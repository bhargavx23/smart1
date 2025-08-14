module smart1::mirror_trading {
    use std::signer;
    use std::string::{String, utf8};
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::event;
    use aptos_std::table::{Self, Table};
    use aptos_std::table_with_length::{Self, TableWithLength};

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_FOLLOWING: u64 = 2;
    const E_NOT_FOLLOWING: u64 = 3;
    const E_INVALID_AMOUNT: u64 = 4;
    const E_INVALID_DELAY: u64 = 5;

    // Struct to store follower rules
    struct FollowerRules has store {
        max_trade_size: u64,
        allowed_tokens: vector<String>,
        delay_seconds: u64,
        stop_loss_percent: u64,
        enabled: bool,
    }

    // Struct to store follower data
    struct FollowerData has store {
        leader_address: address,
        rules: FollowerRules,
        last_trade_timestamp: u64,
    }

    // Global state
    struct MirrorState has key {
        followers: Table<address, FollowerData>, // follower_address -> FollowerData
        leaders: Table<address, TableWithLength<address, bool>>, // leader_address -> followers
    }

    // Events
    struct FollowLeaderEvent has drop, store {
        follower: address,
        leader: address,
        rules: FollowerRules,
    }

    struct UnfollowLeaderEvent has drop, store {
        follower: address,
        leader: address,
    }

    struct MirrorTradeEvent has drop, store {
        leader: address,
        follower: address,
        token_in: String,
        token_out: String,
        amount_in: u64,
        amount_out: u64,
    }

    // Initialize the module
    public entry fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        assert!(addr == @smart1, E_NOT_INITIALIZED);
        
        let state = MirrorState {
            followers: table::new(),
            leaders: table::new(),
        };
        move_to(account, state);
    }

    // Follow a leader with custom rules
    public entry fun follow_leader(
        follower: &signer,
        leader_address: address,
        max_trade_size: u64,
        allowed_tokens: vector<String>,
        delay_seconds: u64,
        stop_loss_percent: u64,
    ) acquires MirrorState {
        let follower_addr = signer::address_of(follower);
        let state = borrow_global_mut<MirrorState>(@smart1);
        
        // Check if already following this leader
        assert!(!table::contains(&state.followers, follower_addr), E_ALREADY_FOLLOWING);
        
        let rules = FollowerRules {
            max_trade_size,
            allowed_tokens,
            delay_seconds,
            stop_loss_percent,
            enabled: true,
        };
        
        let follower_data = FollowerData {
            leader_address,
            rules,
            last_trade_timestamp: 0,
        };
        
        table::add(&mut state.followers, follower_addr, follower_data);
        
        // Add to leader's followers list
        if (!table::contains(&state.leaders, leader_address)) {
            table::add(&mut state.leaders, leader_address, table_with_length::new());
        };
        
        let followers = table::borrow_mut(&mut state.leaders, leader_address);
        table_with_length::add(followers, follower_addr, true);
        
        event::emit(FollowLeaderEvent {
            follower: follower_addr,
            leader: leader_address,
            rules,
        });
    }

    // Unfollow a leader
    public entry fun unfollow_leader(follower: &signer, leader_address: address) acquires MirrorState {
        let follower_addr = signer::address_of(follower);
        let state = borrow_global_mut<MirrorState>(@smart1);
        
        assert!(table::contains(&state.followers, follower_addr), E_NOT_FOLLOWING);
        
        let follower_data = table::borrow(&state.followers, follower_addr);
        assert!(follower_data.leader_address == leader_address, E_NOT_FOLLOWING);
        
        table::remove(&mut state.followers, follower_addr);
        
        // Remove from leader's followers list
        let followers = table::borrow_mut(&mut state.leaders, leader_address);
        table_with_length::remove(followers, follower_addr);
        
        event::emit(UnfollowLeaderEvent {
            follower: follower_addr,
            leader: leader_address,
        });
    }

    // Update follower rules
    public entry fun update_rules(
        follower: &signer,
        max_trade_size: u64,
        allowed_tokens: vector<String>,
        delay_seconds: u64,
        stop_loss_percent: u64,
    ) acquires MirrorState {
        let follower_addr = signer::address_of(follower);
        let state = borrow_global_mut<MirrorState>(@smart1);
        
        assert!(table::contains(&state.followers, follower_addr), E_NOT_FOLLOWING);
        
        let follower_data = table::borrow_mut(&mut state.followers, follower_addr);
        follower_data.rules = FollowerRules {
            max_trade_size,
            allowed_tokens,
            delay_seconds,
            stop_loss_percent,
            enabled: true,
        };
    }

    // Get follower data
    public fun get_follower_data(follower_address: address): (address, FollowerRules) acquires MirrorState {
        let state = borrow_global<MirrorState>(@smart1);
        assert!(table::contains(&state.followers, follower_address), E_NOT_FOLLOWING);
        
        let follower_data = table::borrow(&state.followers, follower_address);
        (follower_data.leader_address, follower_data.rules)
    }

    // Get leader's followers count
    public fun get_followers_count(leader_address: address): u64 acquires MirrorState {
        let state = borrow_global<MirrorState>(@smart1);
        
        if (!table::contains(&state.leaders, leader_address)) {
            0
        } else {
            let followers = table::borrow(&state.leaders, leader_address);
            table_with_length::length(followers)
        }
    }

    // Mirror a trade (called by backend service)
    public entry fun mirror_trade(
        follower: &signer,
        token_in: String,
        token_out: String,
        amount_in: u64,
        amount_out: u64,
    ) acquires MirrorState {
        let follower_addr = signer::address_of(follower);
        let state = borrow_global_mut<MirrorState>(@smart1);
        
        assert!(table::contains(&state.followers, follower_addr), E_NOT_FOLLOWING);
        
        let follower_data = table::borrow(&state.followers, follower_addr);
        assert!(follower_data.rules.enabled, E_NOT_INITIALIZED);
        
        // Here you would integrate with a DEX contract
        // For now, we just emit the event
        event::emit(MirrorTradeEvent {
            leader: follower_data.leader_address,
            follower: follower_addr,
            token_in,
            token_out,
            amount_in,
            amount_out,
        });
    }
}
