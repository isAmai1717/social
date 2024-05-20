class Player {
    constructor(name, health = 100) {
        this.name = name;
        this.health = health;
        this.friends = [];
    }

    addFriend(friend) {
        if (!this.friends.includes(friend)) {
            this.friends.push(friend);
        }
    }

    attack(other) {
        const damage = 10;
        other.health -= damage;
        document.getElementById('output').innerHTML = `${this.name} attacked ${other.name}, causing ${damage} damage. ${other.name} now has ${other.health} health.`;
    }
}
// 先創建一些玩家
let players = [
    new Player("Ethan"),
    new Player("Bob"),
    new Player("Charlie"),
    new Player("Diana"),
    new Player("Tim"),
    new Player("Frank"),
    new Player("Alice")
];

// 以玩家0當作主要玩家，加入一些好友
players[0].addFriend(players[1]);
players[0].addFriend(players[4]);
players[0].addFriend(players[5]);

// 當點擊社交按鈕，則會顯示好友或隨機玩家，代表你可以選擇查看好友清單或是隨機跳出一個陌生玩家
document.addEventListener('DOMContentLoaded', function() {
    var socialButton = document.getElementById('socialButton');
    socialButton.addEventListener('click', function() {
        var socialOptions = document.getElementById('socialOptions');
        var output = document.getElementById('output'); // 獲取顯示玩家與隨機玩家的元素

        if (socialOptions.style.display == 'none' || socialOptions.innerHTML == '') {
            // 內容為空則顯示內容
            socialOptions.style.display = 'block';
            socialOptions.innerHTML = `
                <button onclick="displayFriends(players[0])">好友</button>
                <button onclick="displayStranger(players)">隨機玩家</button>
            `;
            output.innerHTML = ''; // 清除顯示的所有內容
        } else {
            // 若已顯示，則清除並隱藏
            socialOptions.innerHTML = '';
            socialOptions.style.display = 'none';
            output.innerHTML = ''; // 清除顯示的所有內容
        }
    });
});

function displayFriends(player) {
    const output = document.getElementById('output');
    output.innerHTML = '好友列表:<br>';
    player.friends.forEach((friend, index) => {
        output.innerHTML += `
            <p>姓名：${friend.name}</p>
            <p>血量：${friend.health}</p>
            <button onclick="attackFriend(${index}, '${player.name}')">攻擊</button>
            <hr>
        `;
    });
}

function attackFriend(index, playerName) {
    const player = players.find(p => p.name == playerName);
    const friend = player.friends[index];
    if (friend.health > 0) {
        friend.health -= 10; // 每次攻擊減少10點血量
        alert(`${friend.name} 受到攻擊, 剩餘血量：${friend.health}`);
        displayFriends(player); // 更新好友列表以顯示新的血量
    } else {
        alert(`${friend.name} 已經被擊敗`);
    }
}

function displayStranger(players) {
    const output = document.getElementById('output');
    // 篩選非好友且非當前玩家自己的其他玩家
    const nonFriends = players.filter(p => !players[0].friends.includes(p) && p !== players[0]);
    if (nonFriends.length === 0) {
        output.innerHTML = '沒有更多的陌生玩家了。';
        return;
    }
    const randomIndex = Math.floor(Math.random() * nonFriends.length);
    const stranger = nonFriends[randomIndex];

    // 直接顯示隨機玩家的詳細信息
    output.innerHTML = `
        <h3>隨機玩家資料</h3>
        <p>玩家名稱: ${stranger.name}</p>
        <p>剩餘血量: ${stranger.health}</p>
        <button onclick="addFriend(${players.indexOf(stranger)})">添加好友</button>
        <button onclick="players[0].attack(stranger)">攻擊</button>
    `;
}

function addFriend(index) {
    const stranger = players[index];
    players[0].addFriend(stranger);
    alert(`${stranger.name} 已被添加到好友列表`);
    displayFriends(players[0]);  // 更新好友列表顯示
}






