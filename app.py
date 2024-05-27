from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

class Player:
    def __init__(self, name, health=100):
        self.name = name
        self.health = health
        self.friends = []

    def add_friend(self, friend):
        if friend not in self.friends:
            self.friends.append(friend)

    def attack(self, other):
        damage = 10
        other.health -= damage
        return f"{self.name} 攻擊了 {other.name}，造成 {damage} 點傷害。{other.name} 現在剩餘 {other.health} 點血量。"

players = [
    Player("Ethan"),
    Player("Bob"),
    Player("Charlie"),
    Player("Diana"),
    Player("Tim"),
    Player("Frank"),
    Player("Alice")
]

# 初始化好友
players[0].add_friend(players[1])
players[0].add_friend(players[4])
players[0].add_friend(players[5])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/friends/<name>')
def get_friends(name):
    player = next(p for p in players if p.name == name)
    friends = [{"name": friend.name, "health": friend.health} for friend in player.friends]
    return jsonify(friends)

@app.route('/attack', methods=['POST'])
def attack():
    data = request.json
    player_name = data['player']
    friend_name = data['friend']
    player = next(p for p in players if p.name == player_name)
    friend = next(f for f in player.friends if f.name == friend_name)
    if friend.health > 0:
        message = player.attack(friend)
        return jsonify({"message": message, "health": friend.health})
    else:
        return jsonify({"message": f"{friend.name} 已經被擊敗", "health": 0})

@app.route('/stranger')
def stranger():
    player = players[0]
    non_friends = [p for p in players if p not in player.friends and p != player]
    if not non_friends:
        return jsonify({"message": "沒有更多的陌生玩家了。"})
    stranger = random.choice(non_friends)
    return jsonify({"name": stranger.name, "health": stranger.health})

@app.route('/add_friend', methods=['POST'])
def add_friend():
    data = request.json
    friend_name = data['friend']
    friend = next(p for p in players if p.name == friend_name)
    players[0].add_friend(friend)
    return jsonify({"message": f"{friend.name} 已被添加到好友列表"})

@app.route('/attack_stranger', methods=['POST'])
def attack_stranger():
    data = request.json
    player_name = data['player']
    stranger_name = data['stranger']
    player = next(p for p in players if p.name == player_name)
    stranger = next(s for s in players if s.name == stranger_name and s not in player.friends)
    if stranger.health > 0:
        message = player.attack(stranger)
        return jsonify({"message": message, "health": stranger.health})
    else:
        return jsonify({"message": f"{stranger.name} 已經被擊敗", "health": 0})

if __name__ == '__main__':
    app.run(debug=True)
