# Clear existing data
Friendship.destroy_all
LyricSnippet.destroy_all
User.destroy_all


LyricSnippet.find_or_create_by!(
  snippet: "Dummy snippet for failed rounds",
  artist: "System",
  song: "Failed Round",
  difficulty: 0,
  language: "English"
)
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

# Create users
users = [
  { name: "Alice", email: "alice@example.com", password: "123123", language: "English" },
  { name: "Bob", email: "bob@example.com", password: "password123", language: "English" },
  { name: "Charlie", email: "charlie@example.com", password: "password123", language: "English" },
  { name: "David", email: "david@example.com", password: "password123", language: "German" },
  { name: "Eva", email: "eva@example.com", password: "password123", language: "German" },
  { name: "Frank", email: "frank@example.com", password: "password123", language: "English" },
  { name: "Grace", email: "grace@example.com", password: "password123", language: "German" },
  { name: "Henry", email: "henry@example.com", password: "password123", language: "English" },
  { name: "Ivy", email: "ivy@example.com", password: "password123", language: "German" },
  { name: "Jack", email: "jack@example.com", password: "password123", language: "English" }
]

created_users = User.create!(users)

# Assign users to variables
alice, bob, charlie, david, eva, frank, grace, henry, ivy, jack = created_users

# Create friendships
def create_bidirectional_friendship(user1, user2, status)
  Friendship.create!(user: user1, friend: user2, status: status)
  Friendship.create!(user: user2, friend: user1, status: status) if status == :accepted
end

# Accepted friendships
create_bidirectional_friendship(alice, bob, :accepted)
create_bidirectional_friendship(alice, charlie, :accepted)
create_bidirectional_friendship(alice, david, :accepted)
create_bidirectional_friendship(bob, eva, :accepted)
create_bidirectional_friendship(charlie, frank, :accepted)

# Pending friend requests sent
Friendship.create!(user: alice, friend: eva, status: :pending)
Friendship.create!(user: bob, friend: grace, status: :pending)
Friendship.create!(user: charlie, friend: henry, status: :pending)
Friendship.create!(user: david, friend: ivy, status: :pending)
Friendship.create!(user: eva, friend: jack, status: :pending)

# Pending friend requests received
Friendship.create!(user: frank, friend: alice, status: :pending)
Friendship.create!(user: grace, friend: bob, status: :pending)
Friendship.create!(user: henry, friend: charlie, status: :pending)
Friendship.create!(user: ivy, friend: david, status: :pending)
Friendship.create!(user: jack, friend: eva, status: :pending)

# Declined friend requests
Friendship.create!(user: alice, friend: grace, status: :declined)
Friendship.create!(user: bob, friend: henry, status: :declined)
Friendship.create!(user: charlie, friend: ivy, status: :declined)
Friendship.create!(user: david, friend: jack, status: :declined)
Friendship.create!(user: eva, friend: frank, status: :declined)

p "Seed done 😍"
p "Created #{LyricSnippet.count} lyric snippets"
p "Created #{User.count} users"
p "Created #{Friendship.count} friendships"
p "Accepted friendships: #{Friendship.where(status: :accepted).count}"
p "Pending friendships: #{Friendship.where(status: :pending).count}"
p "Declined friendships: #{Friendship.where(status: :declined).count}"
