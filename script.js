document.addEventListener('DOMContentLoaded', function() {
    var socialButton = document.getElementById('socialButton');
    socialButton.addEventListener('click', function() {
        var socialOptions = document.getElementById('socialOptions');
        var output = document.getElementById('output');

        if (socialOptions.style.display == 'none' || socialOptions.innerHTML == '') {
            socialOptions.style.display = 'block';
            socialOptions.innerHTML = `
                <button id="showFriends">好友</button>
                <button id="showStranger">隨機玩家</button>
            `;
            output.innerHTML = '';

            document.getElementById('showFriends').addEventListener('click', function() {
                fetch('/friends/Ethan')
                    .then(response => response.json())
                    .then(data => {
                        output.innerHTML = '好友列表:<br>';
                        data.forEach((friend, index) => {
                            output.innerHTML += `
                                <p>姓名：${friend.name}</p>
                                <p>血量：${friend.health}</p>
                                <button onclick="attackFriend(${index})">攻擊</button>
                                <hr>
                            `;
                        });
                    });
            });

            document.getElementById('showStranger').addEventListener('click', function() {
                fetch('/stranger')
                    .then(response => response.json())
                    .then(data => {
                        if (data.message) {
                            output.innerHTML = data.message;
                        } else {
                            output.innerHTML = `
                                <h3>隨機玩家資料</h3>
                                <p>玩家名稱: ${data.name}</p>
                                <p>剩餘血量: ${data.health}</p>
                                <button onclick="addFriend('${data.name}')">添加好友</button>
                                <button onclick="attackStranger('${data.name}')">攻擊</button>
                            `;
                        }
                    });
            });
        } else {
            socialOptions.innerHTML = '';
            socialOptions.style.display = 'none';
            output.innerHTML = '';
        }
    });
});

function attackFriend(index) {
    fetch('/friends/Ethan')
        .then(response => response.json())
        .then(friends => {
            const friend = friends[index];
            fetch('/attack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    player: 'Ethan',
                    friend: friend.name
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                document.getElementById('showFriends').click();
            });
        });
}

function addFriend(name) {
    fetch('/add_friend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            friend: name
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('showFriends').click();
    });
}

function attackStranger(name) {
    fetch('/attack_stranger', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player: 'Ethan',
            stranger: name
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
}

