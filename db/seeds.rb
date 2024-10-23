# Clear existing data
Friendship.destroy_all
LyricSnippet.destroy_all
User.destroy_all
GameSession.destroy_all

# Create a default snippet for failed rounds
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

# German lyric snippets (replaced with generic text)
german_snippets = [
  { snippet: "deutsch 1", artist: "Rammstein", song: "Spieluhr", difficulty: 350, language: "German" },
  { snippet: "deutsch 2", artist: "Hoffmann von Fallersleben", song: "Die Gedanken sind frei", difficulty: 400, language: "German" },
  { snippet: "deutsch 3", artist: "AnnenMayKantereit", song: "Traumtänzer", difficulty: 450, language: "German" },
  { snippet: "deutsch 4", artist: "Cro", song: "Einmal um die Welt", difficulty: 300, language: "German" },
  { snippet: "deutsch 5", artist: "Wir sind Helden", song: "Denkmal", difficulty: 500, language: "German" }
]

# Create lyric snippets
LyricSnippet.create!(english_snippets + german_snippets)

# Create users
users = [
  { name: "Alice", email: "alice@gmail.com", password: "123123", language: "English" },
  { name: "BobUSA", email: "bobusa@gmail.com", password: "123123", language: "English" },
  { name: "Charlie", email: "charlie@gmail.com", password: "123123", language: "English" },
  { name: "David", email: "david@gmail.com", password: "123123", language: "German" },
  { name: "Eva", email: "eva@gmail.com", password: "123123", language: "German" },
  { name: "Frank", email: "frank@gmail.com", password: "123123", language: "English" },
  { name: "Grace", email: "grace@gmail.com", password: "123123", language: "German" },
  { name: "Henry", email: "henry@gmail.com", password: "123123", language: "English" },
  { name: "Ivy", email: "ivy@gmail.com", password: "123123", language: "German" },
  { name: "Jack", email: "jack@gmail.com", password: "123123", language: "English" },
  { name: "DanNoJapan", email: "dannojapan@gmail.com", password: "123123", language: "German" },
  { name: "50Cent", email: "50cent@gmail.com", password: "123123", language: "English" }
]

created_users = User.create!(users)

# Assign users to variables for reference
alice, bobusa, charlie, david, eva, frank, grace, henry, ivy, jack, dannojapan, fiftycent = created_users

# Create friendships
def create_bidirectional_friendship(user1, user2, status)
  Friendship.create!(user: user1, friend: user2, status: status)
  Friendship.create!(user: user2, friend: user1, status: status) if status == :accepted
end

# Alice's friendships (3 of each status)
# Accepted
create_bidirectional_friendship(alice, bobusa, :accepted)
create_bidirectional_friendship(alice, charlie, :accepted)
create_bidirectional_friendship(alice, eva, :accepted)

# Pending
Friendship.create!(user: alice, friend: david, status: :pending)
Friendship.create!(user: alice, friend: grace, status: :pending)
Friendship.create!(user: alice, friend: henry, status: :pending)

# Pending other way
Friendship.create!(user: ivy, friend: alice, status: :pending)
Friendship.create!(user: fiftycent, friend: alice, status: :pending)
Friendship.create!(user: dannojapan, friend: alice, status: :pending)

# Declined
Friendship.create!(user: alice, friend: frank, status: :declined)
Friendship.create!(user: alice, friend: jack, status: :declined)
# Friendship.create!(user: alice, friend: jack, status: :declined)

# Other friendships (keeping the randomness/chaos intact)
create_bidirectional_friendship(charlie, fiftycent, :accepted)
create_bidirectional_friendship(bobusa, eva, :accepted)
Friendship.create!(user: charlie, friend: ivy, status: :pending)
Friendship.create!(user: frank, friend: dannojapan, status: :pending)
Friendship.create!(user: fiftycent, friend: grace, status: :pending)
Friendship.create!(user: fiftycent, friend: bobusa, status: :pending)
Friendship.create!(user: henry, friend: jack, status: :declined)
Friendship.create!(user: eva, friend: david, status: :declined)
Friendship.create!(user: fiftycent, friend: ivy, status: :declined)

# Output stats
p "Seed done 😍"
p "Created #{LyricSnippet.count} lyric snippets"
p "Created #{User.count} users"
p "Created #{Friendship.count} friendships"
p "Accepted friendships: #{Friendship.where(status: :accepted).count}"
p "Pending friendships: #{Friendship.where(status: :pending).count}"
p "Declined friendships: #{Friendship.where(status: :declined).count}"
