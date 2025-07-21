Friendship.destroy_all
LyricSnippet.destroy_all
User.destroy_all
GameSession.destroy_all

LyricSnippet.find_or_create_by!(
  snippet: "Dummy snippet for failed rounds",
  artist: "System",
  song: "Failed Round",
  difficulty: 0,
  language: "English"
)

english_snippets = [
  { snippet: "Hey, Shawty, we could be friends", artist: "50 Cent", song: "Poor Lil Rich", difficulty: 700, language: "English" },
  { snippet: "Stop flattering yourself", artist: "Arctic Monkeys", song: "Do Me A Favour", difficulty: 400, language: "English" },
  { snippet: "I forgive you almost all the time", artist: "Lana Del Rey", song: "Roses", difficulty: 500, language: "English" },
  { snippet: "The good are never easy, the easy never good", artist: "Marina", song: "Homewrecker", difficulty: 800, language: "English" },
  { snippet: "But don't mess up my hair", artist: "Lady Gaga", song: "Vanity", difficulty: 200, language: "English" },
  { snippet: "I can be good, if you just wanna be bad", artist: "Lady Gaga", song: "Government Hooker", difficulty: 700, language: "English" },
  { snippet: "Don't care if you think I'm dumb. I don't care at all", artist: "Marina", song: "Bubblegum Bitch", difficulty: 500, language: "English" },
  { snippet: "Got your wrapped around my finger, babe", artist: "Marina", song: "Primadonna", difficulty: 800, language: "English" },
  { snippet: "Satisfaction feels like a distant memory", artist: "Arctic Monkeys", song: "R U Mine", difficulty: 600, language: "English" },
  { snippet: "Boy I'm tired, let's walk for a minute", artist: "Nelly Furtado", song: "Promiscuous", difficulty: 300, language: "English" },
  { snippet: "You're hard to hug", artist: "Marina", song: "Starring Role", difficulty: 700, language: "English" },
  { snippet: "It only takes a camera to change her mind", artist: "Kraftwerk", song: "The Model", difficulty: 600, language: "English" },
  { snippet: "I'll let you off easy this one time", artist: "Lana Del Rey", song: "Roses", difficulty: 400, language: "English" },
  { snippet: "You either wanna be with me, or be me", artist: "Nelly Furtado", song: "Maneater", difficulty: 700, language: "English" },
  { snippet: "Let's pretend for a minute you don't know who I am", artist: "Diddy", song: "Tell me", difficulty: 400, language: "English" },
  { snippet: "You gon' be that next chump", artist: "50 Cent", song: "If I Can't", difficulty: 800, language: "English" }
]

german_snippets = [
  { snippet: "Ich will dass ihr mir vertraut", artist: "Rammstein", song: "Ich Will", difficulty: 500, language: "German" },
  { snippet: "Die Gedanken sind frei", artist: "Volksweise", song: "Die Gedanken sind frei", difficulty: 400, language: "German" },
  { snippet: "Lass uns gehen, lass uns gehen", artist: "Peter Fox", song: "Haus am See", difficulty: 300, language: "German" }
  # { snippet: "Ich habe einen Koffer in Berlin", artist: "Marlene Dietrich", song: "Ich hab noch einen Koffer in Berlin", difficulty: 600, language: "German" },
  # { snippet: "Manche Träume sind aus Plastik", artist: "Deichkind", song: "Remmidemmi", difficulty: 700, language: "German" }
]

LyricSnippet.create!(english_snippets + german_snippets)

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

alice, bobusa, charlie, david, eva, frank, grace, henry, ivy, jack, dannojapan, fiftycent = created_users

def create_bidirectional_friendship(user1, user2, status)
  Friendship.create!(user: user1, friend: user2, status: status)
  Friendship.create!(user: user2, friend: user1, status: status) if status == :accepted
end

create_bidirectional_friendship(alice, bobusa, :accepted)
create_bidirectional_friendship(alice, charlie, :accepted)
create_bidirectional_friendship(alice, eva, :accepted)

Friendship.create!(user: alice, friend: david, status: :pending)
Friendship.create!(user: alice, friend: grace, status: :pending)
Friendship.create!(user: alice, friend: henry, status: :pending)

Friendship.create!(user: ivy, friend: alice, status: :pending)
Friendship.create!(user: fiftycent, friend: alice, status: :pending)
Friendship.create!(user: dannojapan, friend: alice, status: :pending)

Friendship.create!(user: alice, friend: frank, status: :declined)
Friendship.create!(user: alice, friend: jack, status: :declined)

create_bidirectional_friendship(charlie, fiftycent, :accepted)
create_bidirectional_friendship(bobusa, eva, :accepted)
Friendship.create!(user: charlie, friend: ivy, status: :pending)
Friendship.create!(user: frank, friend: dannojapan, status: :pending)
Friendship.create!(user: fiftycent, friend: grace, status: :pending)
Friendship.create!(user: fiftycent, friend: bobusa, status: :pending)
Friendship.create!(user: henry, friend: jack, status: :declined)
Friendship.create!(user: eva, friend: david, status: :declined)
Friendship.create!(user: fiftycent, friend: ivy, status: :declined)

# Create a single report for consistent testing
fiftycent = User.find_by(name: "50Cent")
first_english_snippet = LyricSnippet.find_by(snippet: "Hey, Shawty, we could be friends")

SnippetReport.destroy_all

SnippetReport.create!(
  lyric_snippet: first_english_snippet,
  user: fiftycent,
  status: :pending,
  wrong_snippet: true,
  suggested_snippet: "Hey, friends",
  suggested_song: "Rich Only",
  wrong_difficulty: true,
  suggested_difficulty: 100,
  is_boring: false,
  wrong_artist: false,
  wrong_song: true,
  wrong_language: false,
  wrong_image: false
)

p "Seed done 😍"
p "Created #{LyricSnippet.count} lyric snippets"
p "Created #{User.count} users"
p "Created #{Friendship.count} friendships"
p "Created #{SnippetReport.count} snippet reports"
p "Accepted friendships: #{Friendship.where(status: :accepted).count}"
p "Pending friendships: #{Friendship.where(status: :pending).count}"
p "Declined friendships: #{Friendship.where(status: :declined).count}"
