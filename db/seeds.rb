# Clear existing data
Friendship.destroy_all
LyricSnippet.destroy_all
User.destroy_all

# English lyric snippets
english_snippets = [
  { snippet: "Hey, Shawty, we could be friends", artist: "50 Cent", song: "Poor Lil Rich", difficulty: 300, language: "English" },
  { snippet: "Stop flattering yourself", artist: "Arctic Monkeys", song: "Do Me A Favour", difficulty: 400, language: "English" },
  { snippet: "I forgive you almost all the time", artist: "Lana Del Rey", song: "Roses", difficulty: 450, language: "English" },
  { snippet: "The good are never easy, the easy never good", artist: "Marina", song: "Homewrecker", difficulty: 550, language: "English" },
  { snippet: "But don't mess up my hair", artist: "Lady Gaga", song: "Vanity", difficulty: 250, language: "English" }
]

# German lyric snippets
german_snippets = [
  { snippet: "Ich will doch nur spielen", artist: "Rammstein", song: "Spieluhr", difficulty: 350, language: "German" },
  { snippet: "Die Gedanken sind frei", artist: "Hoffmann von Fallersleben", song: "Die Gedanken sind frei", difficulty: 400, language: "German" },
  { snippet: "Lass uns gehen, Traumtänzer", artist: "AnnenMayKantereit", song: "Traumtänzer", difficulty: 450, language: "German" },
  { snippet: "Ich bin immer für dich da", artist: "Cro", song: "Einmal um die Welt", difficulty: 300, language: "German" },
  { snippet: "Du bist das Gegenteil von alledem", artist: "Wir sind Helden", song: "Denkmal", difficulty: 500, language: "German" }
]

# Create lyric snippets
LyricSnippet.create!(english_snippets + german_snippets)

users = [
  { name: "Alice", email: "alice@example.com", password: "password123", language: "English" },
  { name: "Bob", email: "bob@example.com", password: "password123", language: "English" },
  { name: "Charlie", email: "charlie@example.com", password: "password123", language: "English" },
  { name: "David", email: "david@example.com", password: "password123", language: "German" },
  { name: "Eva", email: "eva@example.com", password: "password123", language: "German" },
  { name: "Frank", email: "frank@example.com", password: "password123", language: "English" },
  { name: "Grace", email: "grace@example.com", password: "password123", language: "German" }
]

created_users = User.create!(users)

# Assign users to variables
alice, bob, charlie, david, eva, frank, grace = created_users

# Create friendships centered around Alice

# 1. Accepted friendships (mutual)
Friendship.create!(user: alice, friend: bob, status: :accepted)
Friendship.create!(user: bob, friend: alice, status: :accepted)

Friendship.create!(user: alice, friend: charlie, status: :accepted)
Friendship.create!(user: charlie, friend: alice, status: :accepted)

# 2. Pending friend request sent by Alice
Friendship.create!(user: alice, friend: david, status: :pending)

# 3. Pending friend request received by Alice
Friendship.create!(user: eva, friend: alice, status: :pending)

# 4. Declined friend request sent by Alice
Friendship.create!(user: alice, friend: frank, status: :declined)

# 5. Declined friend request received by Alice
Friendship.create!(user: grace, friend: alice, status: :declined)

# Additional friendships not involving Alice (for testing search functionality)
Friendship.create!(user: bob, friend: eva, status: :accepted)
Friendship.create!(user: eva, friend: bob, status: :accepted)

Friendship.create!(user: charlie, friend: david, status: :pending)

p "Seed done 😍"
p "Created #{LyricSnippet.count} lyric snippets"
p "Created #{User.count} users"
p "Created #{Friendship.count} friendships"
