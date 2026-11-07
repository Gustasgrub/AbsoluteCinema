<?php

/*
| Pradinės recenzijos: [filmo pavadinimas, naudotojas, balas 1–10, antraštė, tekstas, ar yra spoilerių]
| Kiekvienas naudotojas turi savo skonį (žr. UserSeeder), todėl profilių statistika atrodo tikroviškai.
*/

return [
    // ---------- Studio Ghibli ----------
    ['Spirited Away', 'rasa', 10, 'Pure, unfiltered wonder', "Every frame looks like a painting you could step into. The bathhouse alone has more imagination than most franchises, and Chihiro's quiet growth from sulky kid to brave worker is beautifully earned.", false],
    ['Spirited Away', 'ieva', 10, 'A film about work, greed and remembering who you are', 'On rewatch it is surprisingly adult: No-Face as a mirror of loneliness and consumption, the bathhouse as a workplace that swallows names. Joe Hisaishi\'s score does the rest.', false],
    ['Spirited Away', 'dovydas', 9, 'The train scene stays with you', 'The quiet train ride across the flooded plain is one of the most peaceful sequences ever animated. A few side characters could have had more time, but this is near-perfect.', false],
    ['Spirited Away', 'emilija', 9, 'A love story without a single kiss', "The moment she remembers Haku's real name as a river spirit gave me chills. Tender, strange and completely unforgettable.", true],

    ['My Neighbor Totoro', 'rasa', 9, 'The coziest film ever made', "Nothing 'happens' for long stretches and that is exactly the magic. The Catbus is the best public transport in cinema history.", false],
    ['My Neighbor Totoro', 'member', 8, 'Watched it with my little cousin', 'She was hypnotised from the first minute. Simple, gentle, and the rain scene at the bus stop is iconic for a reason.', false],
    ['My Neighbor Totoro', 'ieva', 8, 'Childhood, without the cynicism', 'A film that trusts children to be curious rather than scared. The worry about the mother in hospital gives it a quiet, real weight.', false],

    ['Princess Mononoke', 'lukas', 9, "Miyazaki's war epic", "Huge battles, giant gods and no clear villain. I didn't expect an animated film to feel this much like a historical epic.", false],
    ['Princess Mononoke', 'ieva', 10, 'No heroes, no villains, just consequences', 'Lady Eboshi builds a town that frees outcasts and destroys a forest in the process. The film refuses to give easy answers and is better for it.', false],
    ['Princess Mononoke', 'tomas', 8, 'Surprisingly brutal', 'Severed limbs and a demon boar crawling with worms — this is not Totoro. The opening chase through the village is incredible.', false],

    ["Howl's Moving Castle", 'emilija', 9, 'Sophie deserves the world', 'A curse that turns her old ends up setting her free. Calcifer steals every single scene he is in.', false],
    ["Howl's Moving Castle", 'rasa', 8, 'Gorgeous, a bit messy', 'The castle design is a masterpiece of moving parts. The war storyline in the second half gets confusing, but the feelings land.', false],

    ['Grave of the Fireflies', 'ieva', 10, 'Devastating and necessary', 'One of the most powerful anti-war films ever made, animated or not. Watch it once, carefully, and maybe never again.', false],
    ['Grave of the Fireflies', 'emilija', 9, 'I cried for an hour afterwards', 'The little tin of fruit drops will break your heart. Takahata never manipulates — he simply shows what happens.', false],
    ['Grave of the Fireflies', 'mantas', 8, 'Hard to rate, impossible to forget', "Not something you 'enjoy', but Seita's pride and stubbornness make it more than a simple tragedy.", false],

    ['The Boy and the Heron', 'dovydas', 7, 'Beautiful but puzzling', 'The animation is staggering and the parakeet kingdom is wild. I needed to read an article afterwards to understand the ending.', false],
    ['The Boy and the Heron', 'rasa', 8, 'A goodbye letter from Miyazaki', 'It feels deeply personal — about grief, legacy and choosing your own world. Not his most accessible film, but a moving one.', false],

    // ---------- Pixar ----------
    ['Toy Story', 'rasa', 9, 'Still holds up thirty years later', "The animation of the humans has aged, the writing hasn't. Woody's jealousy is such an honest emotion for a children's film.", false],
    ['Toy Story', 'member', 8, 'Nostalgia trip', "Watched it again for the first time since childhood. The sequence in Sid's house is still creepy in the best way.", false],
    ['Toy Story', 'lukas', 7, 'Historic, but I prefer the sequels', 'It changed animation forever. Story-wise, the third film hits much harder for me.', false],

    ['WALL·E', 'dovydas', 10, 'The best sci-fi film with almost no dialogue', 'The first forty minutes are nearly silent and completely gripping. It says more about consumerism than most serious dramas.', false],
    ['WALL·E', 'rasa', 10, 'Robots in love', "WALL·E holding EVE's hand while she is switched off gets me every single time.", false],
    ['WALL·E', 'ieva', 8, 'A bold first half', 'The silent Earth section is a masterpiece; the spaceship half is more conventional but still sharp.', false],

    ['Up', 'emilija', 10, 'Those first ten minutes', 'A whole marriage told in a wordless montage. I was crying before the house even took off.', false],
    ['Up', 'rasa', 9, 'Adventure is out there', 'Funny, sad and full of heart. Dug the talking dog is a national treasure.', false],
    ['Up', 'lukas', 7, 'Great start, standard ending', 'The opening is perfect; the villain plot in the jungle felt like a different, weaker film.', false],

    ['Ratatouille', 'rasa', 9, 'A love letter to cooking', "Anton Ego's final monologue about critics is something I think about every time I write a review here.", false],
    ['Ratatouille', 'mantas', 8, 'A heist film in a kitchen', 'The chases through Paris are slick and the food looks good enough to eat off the screen.', false],

    ['Inside Out', 'emilija', 9, 'Sadness is the hero', "The idea that sadness is needed to feel joy is incredibly mature. Bing Bong's goodbye wrecked me.", true],
    ['Inside Out', 'greta', 8, 'Clever concept, perfectly executed', 'Turning abstract thoughts into actual places — the train of thought, the abstract thinking room — is pure Pixar genius.', false],
    ['Inside Out', 'member', 7, 'Fun for the whole family', 'My parents liked it more than I did, honestly. Still very clever and very colourful.', false],

    ['Coco', 'emilija', 10, 'That final song', 'The last song Miguel sings to his great-grandmother is one of the most emotional scenes in animation.', true],
    ['Coco', 'rasa', 9, 'A celebration of family', 'The Land of the Dead is bursting with colour and detail. The twist about the famous singer genuinely surprised me.', true],

    // ---------- A24 ----------
    ['Moonlight', 'ieva', 10, 'Quiet, tender, perfect', 'Three actors, one character, and you believe every moment. The diner scene is some of the finest acting I have seen.', false],
    ['Moonlight', 'emilija', 9, 'So much said with so little', 'Jenkins lets silence and colour carry the story. It is about masculinity, love and the masks we wear.', false],
    ['Moonlight', 'lukas', 6, 'Well made, not for me', 'I can see why critics love it, but the slow pace lost me in the middle chapter.', false],

    ['Hereditary', 'tomas', 10, 'The scariest film of the decade', 'It starts as a family drama and slowly turns into a nightmare. Toni Collette deserved every award going.', false],
    ['Hereditary', 'mantas', 7, 'Great until the last ten minutes', 'The tension is unbearable and the car scene is a gut punch. The ending explains a bit too much for my taste.', true],
    ['Hereditary', 'greta', 8, 'Never sleeping again', 'That tongue click. I hear it in my apartment at night now.', false],

    ['Everything Everywhere All at Once', 'dovydas', 10, 'Multiverse done right', 'Funny, inventive, chaotic — and underneath it all, a story about a mother and a daughter. Hot dog fingers forever.', false],
    ['Everything Everywhere All at Once', 'emilija', 9, 'Kindness as a superpower', "Waymond's speech about being kind turned a wild action-comedy into something genuinely moving.", false],
    ['Everything Everywhere All at Once', 'lukas', 8, 'Exhausting in a good way', 'Too long by fifteen minutes, but the fights are inventive and the fanny-pack fight is genius.', false],
    ['Everything Everywhere All at Once', 'tomas', 6, 'Too much of everything', 'I admire the energy, but after two hours of constant chaos I was simply tired.', false],

    ['Past Lives', 'emilija', 10, 'In-yeon', 'The idea of connections that stretch across lifetimes is so beautiful. The final walk to the taxi destroyed me.', true],
    ['Past Lives', 'ieva', 9, 'Restraint as a superpower', 'No villains, no melodrama — just three adults being kind to each other in an impossible situation.', false],
    ['Past Lives', 'greta', 8, 'Small but huge', 'A quiet film that keeps growing in your head for days afterwards.', false],

    ['Uncut Gems', 'mantas', 9, 'Two hours of panic attack', 'Adam Sandler is electric. The Safdies make every single phone call feel like a bomb going off.', false],
    ['Uncut Gems', 'tomas', 8, 'Stressful in the best way', 'I had to pause twice just to breathe. The ending hits like a truck.', false],
    ['Uncut Gems', 'ieva', 6, 'Admirable but exhausting', 'Technically brilliant, but I did not want to spend another minute with these people.', false],

    ['Lady Bird', 'emilija', 9, 'Mothers and daughters', 'Every argument in the car feels real. The final phone message made me call my own mum.', false],
    ['Lady Bird', 'ieva', 8, 'Small-town love letter', 'Gerwig captures the cringe and warmth of senior year without ever mocking her characters.', false],
    ['Lady Bird', 'member', 7, 'Funny and honest', 'Saoirse Ronan is great. A little short — I wanted more of the friendship with Julie.', false],

    // ---------- Warner Bros. ----------
    ['The Matrix', 'dovydas', 10, 'Changed sci-fi forever', 'Bullet time, philosophy and leather coats. The lobby shootout still looks better than most modern action.', false],
    ['The Matrix', 'lukas', 9, 'Peak action cinema', 'The kung fu training and the helicopter rescue are timeless. Ignore the sequels.', false],
    ['The Matrix', 'mantas', 8, 'Cool beyond words', 'The style is iconic and the story is surprisingly smart. Agent Smith is a great villain.', false],

    ['The Dark Knight', 'lukas', 10, 'The best superhero film ever', "Heath Ledger's Joker is terrifying and the interrogation scene is perfect. Feels more like a crime epic than a comic book film.", false],
    ['The Dark Knight', 'mantas', 10, 'A crime saga with capes', 'Nolan made a sprawling crime drama set in Gotham. The opening bank heist is a masterclass.', false],
    ['The Dark Knight', 'tomas', 9, 'That pencil trick', "Ledger is unforgettable. Two-Face's arc is a bit rushed, but the rest is close to flawless.", false],
    ['The Dark Knight', 'ieva', 7, 'Impressive, overrated', 'Very well made, but long, noisy and a little too pleased with its own darkness.', false],

    ['Inception', 'dovydas', 9, 'A puzzle box with a heart', 'The rotating hallway fight is incredible, and that spinning top in the last shot still starts arguments at every dinner.', true],
    ['Inception', 'lukas', 9, 'A blockbuster for adults', 'Original idea, huge scale and that famous Hans Zimmer horn. They do not make many like this anymore.', false],
    ['Inception', 'mantas', 8, 'Best heist structure ever', 'Each dream layer is its own heist movie. The exposition is heavy, but it pays off.', false],
    ['Inception', 'greta', 7, 'Fun but cold', "I admired it more than I felt anything. The story of Cobb and his wife didn't reach me.", false],

    ['Mad Max: Fury Road', 'lukas', 10, 'Two hours of pure adrenaline', 'Practical stunts, insane vehicles and the flame-guitar guy. A masterpiece of visual storytelling.', false],
    ['Mad Max: Fury Road', 'mantas', 9, 'Furiosa is the real hero', 'Barely any dialogue and still a rich world. Charlize Theron owns this film.', false],
    ['Mad Max: Fury Road', 'tomas', 8, 'What a lovely day', 'Relentless and gorgeous. The orange-and-teal palette deserves its own museum.', false],

    ['Dune', 'dovydas', 9, 'Finally, Dune on screen', 'Villeneuve nails the scale — the ornithopters, the sandworm, the chanting soldiers. It is half a story, but what a half.', false],
    ['Dune', 'lukas', 9, 'Made for the biggest screen', 'The sound design alone is worth the ticket. Watch it back to back with Part Two.', false],
    ['Dune', 'ieva', 7, 'Beautiful, but a long prologue', 'Visually stunning, emotionally distant. It ends right where it starts getting interesting.', false],

    ['Barbie', 'emilija', 9, 'Smarter than it looks', "America Ferrera's monologue hit hard, and Ryan Gosling singing about being just Ken is legendary.", false],
    ['Barbie', 'member', 8, 'Pink, funny and sharp', 'Went in expecting a toy commercial and got a satire with heart. The production design is incredible.', false],
    ['Barbie', 'lukas', 6, 'Fun, but uneven', 'Great jokes in the first half, but the message gets very on-the-nose in the third act.', false],
    ['Barbie', 'greta', 8, 'Kenough', 'Funny, self-aware and surprisingly emotional at the very end.', false],

    // ---------- HBO ----------
    ['The Sopranos', 'greta', 10, 'The greatest TV drama ever made', 'Every season adds new layers to Tony and everyone around him. The writing reads like a great novel.', false],
    ['The Sopranos', 'mantas', 10, 'Gangster therapy', 'The sessions with Dr. Melfi are as tense as any hit job. James Gandolfini is a force of nature.', false],
    ['The Sopranos', 'lukas', 8, 'Slow burn, big payoff', 'Some episodes feel like detours, but by season three I was completely hooked.', false],

    ['Chernobyl', 'ieva', 10, 'Terrifyingly precise', 'The sound design, the grey Soviet interiors, the slow realisation of the scale. And much of it was filmed right here in Vilnius.', false],
    ['Chernobyl', 'greta', 10, 'Five perfect episodes', 'No filler and no wasted scene. The courtroom finale that explains the reactor is television at its best.', false],
    ['Chernobyl', 'tomas', 9, 'Scarier than most horror', 'An invisible enemy you cannot fight. The rooftop clean-up sequence was unbearable to watch.', false],
    ['Chernobyl', 'dovydas', 9, 'Science as drama', 'It makes nuclear physics understandable and gripping. Jared Harris is brilliant as Legasov.', false],
    ['Chernobyl', 'mantas', 9, 'I recognised the streets', 'Seeing Fabijoniškės play the city of Pripyat was surreal. A powerful story about lies and their cost.', false],

    ['Succession', 'greta', 10, 'Shakespeare with private jets', 'The most quotable insults on television. Every Roy sibling is awful and you still root for them.', false],
    ['Succession', 'mantas', 9, 'Business as war', 'The boardroom betrayals are more thrilling than most action scenes. That press conference at the end of season two is perfect.', true],
    ['Succession', 'emilija', 8, 'Painful to watch, impossible to stop', 'These people are miserable and so is their father. The theme music lives in my head rent free.', false],

    ['The Last of Us', 'tomas', 9, 'Faithful and bold', 'The infected are terrifying, but the human stories hit harder. Episode three is a standalone masterpiece.', false],
    ['The Last of Us', 'greta', 9, "Bill and Frank's episode", 'An hour of TV that has almost nothing to do with the main plot and is still the best one. Bella Ramsey is perfect as Ellie.', false],
    ['The Last of Us', 'lukas', 7, 'Not enough action', "Beautifully acted, but I expected more of the game's tension and fewer detours.", false],

    ['Game of Thrones', 'lukas', 9, 'The first four seasons are untouchable', 'The battles, the betrayals, the Red Wedding. Rating it as a whole hurts, but the highs are the highest on TV.', true],
    ['Game of Thrones', 'greta', 7, "Brilliant until it wasn't", 'Six seasons of incredible television and two rushed ones. The ending undid a lot of good work.', false],
    ['Game of Thrones', 'mantas', 8, 'Politics with dragons', 'The scheming in King\'s Landing beats any battle. Tyrion carries the show.', false],
    ['Game of Thrones', 'tomas', 8, 'The Long Night was too dark', 'Literally — I could not see anything. Still, the early seasons are legendary.', false],

    // ---------- Netflix ----------
    ['Stranger Things', 'greta', 9, 'Eighties nostalgia done right', "The kids' friendship is the heart of it all. The Kate Bush scene in season four is iconic.", false],
    ['Stranger Things', 'tomas', 8, 'A fun monster mash', 'Spooky enough to be exciting, warm enough to rewatch. Season one is still the best.', false],
    ['Stranger Things', 'dovydas', 8, 'Sci-fi for everyone', 'The Upside Down lore is great. Some later seasons are bloated, but the finale wrapped it up well.', false],

    ['Dark', 'dovydas', 10, 'The best time-travel story ever told', 'Every loop and every family-tree connection is planned. Keep a notebook nearby.', false],
    ['Dark', 'greta', 9, 'You will need a whiteboard', 'Complex but incredibly rewarding. German television at its finest.', false],
    ['Dark', 'tomas', 9, 'Gloomy and gorgeous', 'The atmosphere in Winden is so heavy you can feel the rain. The soundtrack is haunting.', false],

    ['The Crown', 'greta', 9, 'Lavish and intelligent', 'Recasting every two seasons keeps it fresh. Claire Foy and Olivia Colman are both superb.', false],
    ['The Crown', 'emilija', 8, 'History, but personal', 'I love how it focuses on loneliness behind the palace walls. The Aberfan episode is heartbreaking.', false],
    ['The Crown', 'ieva', 7, 'Beautiful, uneven', 'The early seasons are excellent drama; the later ones feel more like a reconstruction of headlines.', false],

    ['Squid Game', 'tomas', 10, 'Red light, green light', 'The first game is one of the most shocking scenes I have seen on TV. A brutal critique of debt and inequality.', false],
    ['Squid Game', 'greta', 8, 'A gripping first season', 'The marbles episode is heartbreaking. Later seasons do not hit as hard, but they are still worth it.', false],
    ['Squid Game', 'mantas', 8, 'A survival thriller with a message', 'Simple premise, amazing tension. Gi-hun is a messy, very human hero.', false],

    ['BoJack Horseman', 'greta', 10, 'A cartoon horse made me rethink my life', 'It starts as a silly comedy and becomes one of the most honest shows about depression and accountability.', false],
    ['BoJack Horseman', 'emilija', 9, 'Funny until it is not', 'The underwater episode and the funeral monologue are pieces of art.', false],
    ['BoJack Horseman', 'ieva', 9, 'Animation for grown-ups', 'Sharp Hollywood satire that turns into a moving character study. Hollywoo forever.', false],

    ['Arcane', 'rasa', 10, 'Animation has a new benchmark', 'Every frame looks like painted concept art. The studio behind it has created a completely new style.', false],
    ['Arcane', 'dovydas', 9, "You don't need to know the game", "I never played the game and was still pulled in. Jinx's story is tragic and fascinating.", false],
    ['Arcane', 'greta', 9, 'Vi and Jinx', 'The sister relationship is the heart of the show. The first season finale left me speechless.', true],

    // ---------- Aardman ----------
    ['Chicken Run', 'rasa', 9, 'Stop-motion magic', 'The pie machine sequence is a classic. Mrs Tweedy is genuinely frightening.', false],
    ['Chicken Run', 'member', 8, 'A great escape parody', 'So many film references. A perfect pick for a family movie night.', false],

    ['Wallace & Gromit: The Curse of the Were-Rabbit', 'rasa', 9, 'Very British, very funny', 'Gromit never says a word and is still the best actor in the film. Endless visual puns.', false],
    ['Wallace & Gromit: The Curse of the Were-Rabbit', 'mantas', 8, 'A monster movie for vegetables', 'A loving parody of old horror films. The dogfight on the fairground planes is brilliant.', false],

    ['Shaun the Sheep Movie', 'rasa', 8, 'No dialogue needed', 'Funny from start to finish without a single spoken word. The restaurant scene had me in tears.', false],
    ['Shaun the Sheep Movie', 'member', 8, 'Perfect for kids and adults', 'A simple story, clever gags and lots of heart.', false],

    ['Early Man', 'rasa', 7, 'Charming but light', 'Lovely to look at, but the football jokes wear thin. Not the studio\'s best.', false],
    ['Early Man', 'lukas', 6, 'Fun once', 'Nice animation and a few good laughs. Kids will enjoy it more than adults.', false],

    ['Wallace & Gromit: Vengeance Most Fowl', 'rasa', 9, 'Feathers McGraw returns', 'The penguin is still the most menacing villain in British animation. The canal chase is brilliant.', false],
    ['Wallace & Gromit: Vengeance Most Fowl', 'mantas', 8, 'A proper sequel to a classic', 'Rewards thirty years of fans and adds a funny commentary on smart gadgets.', false],
    ['Wallace & Gromit: Vengeance Most Fowl', 'greta', 8, 'A new Christmas tradition', 'Watched it on Christmas Day with the whole family. Everyone laughed, even grandma.', false],
];
