export interface GuideSection {
  heading: string;
  content: string;
}

export interface Guide {
  id: string;
  emoji: string;
  title: string;
  description: string;
  signs: string[];
  hiddenBehaviors: string[];
  howToRespond: string[];
  howToTalk: { prompt: string; example: string }[];
}

export interface AgeGroup {
  id: string;
  label: string;
  emoji: string;
  color: string;
  guides: Guide[];
}

export const parentingGuides: AgeGroup[] = [
  {
    id: "5-12",
    label: "Ages 5–12",
    emoji: "🧒",
    color: "from-amber-400 to-orange-500",
    guides: [
      {
        id: "friendship-conflicts",
        emoji: "🤝",
        title: "Friendship Conflicts & Social Exclusion",
        description: "Children between 5–12 are learning how friendships work. They experience rejection, being left out, cliques forming, and loyalty tests. These early social wounds can shape how they handle relationships for life.",
        signs: [
          "Suddenly doesn't want to go to school or a friend's house",
          "Comes home saying \"nobody likes me\" or \"I have no friends\"",
          "Becomes unusually quiet after school or avoids talking about their day",
          "Starts being mean to siblings as a way of releasing frustration",
          "Changes eating or sleeping patterns without a clear reason"
        ],
        hiddenBehaviors: [
          "Pretends everything is fine but draws sad pictures or writes angry notes",
          "Becomes overly clingy to one friend out of fear of losing them",
          "Starts giving away toys or snacks to \"buy\" friendship",
          "Avoids group activities but won't explain why",
          "Mimics the behavior of the child who excluded them to fit in"
        ],
        howToRespond: [
          "Don't dismiss their feelings — \"It's just kids being kids\" invalidates their pain",
          "Help them name the emotion: \"It sounds like you felt left out and that really hurt\"",
          "Role-play scenarios at home: practice what to say when excluded",
          "Avoid fighting their battles — guide them to speak up for themselves",
          "Arrange low-pressure playdates with one child at a time to rebuild confidence",
          "Talk to the teacher privately if patterns persist"
        ],
        howToTalk: [
          { prompt: "Opening the conversation", example: "\"I noticed you seemed a little sad after school. Want to tell me what happened? I'm not going to fix it — I just want to listen.\"" },
          { prompt: "Validating their feelings", example: "\"That sounds really hurtful. It's okay to feel sad when friends leave us out. Even grown-ups feel that way sometimes.\"" },
          { prompt: "Building resilience", example: "\"A true friend makes you feel good about yourself. If someone keeps making you feel bad, it's okay to find other friends. You deserve kindness.\"" }
        ]
      },
      {
        id: "self-image",
        emoji: "🪞",
        title: "Developing Self-Image & Comparison",
        description: "Children as young as 5 start comparing themselves to others — their looks, clothes, toys, and abilities. Social media exposure, even indirectly, accelerates this. Left unchecked, it erodes self-worth and breeds envy or shame.",
        signs: [
          "Frequently says \"I'm ugly\" or \"I'm not as smart as [name]\"",
          "Refuses to wear certain clothes because of how they look",
          "Obsesses over brands, trends, or what other kids have",
          "Gets upset seeing others receive praise or attention",
          "Starts avoiding mirrors or, conversely, spending too long in front of them"
        ],
        hiddenBehaviors: [
          "Puts down other children to feel better about themselves",
          "Becomes a perfectionist — tears up artwork that isn't \"good enough\"",
          "Seeks constant validation: \"Am I pretty?\" \"Am I the best?\"",
          "Withdraws from activities where they aren't immediately the best",
          "Develops unexplained stomachaches before events with peers"
        ],
        howToRespond: [
          "Praise effort and character, not appearance: \"You worked so hard on that\" instead of \"You look so pretty\"",
          "Limit exposure to image-focused content, including YouTube kids' beauty channels",
          "Model self-acceptance: let your child hear you say kind things about your own body",
          "Celebrate differences: \"Everyone's body is different and that's what makes us special\"",
          "Avoid comparing siblings: never say \"Why can't you be more like your brother?\""
        ],
        howToTalk: [
          { prompt: "When they compare themselves", example: "\"I hear you saying [name] is better than you. But you know what? You have your own amazing strengths. Let's think of three things you're really good at.\"" },
          { prompt: "When they criticize their appearance", example: "\"Your body is healthy, strong, and carries you through every adventure. That's something to be proud of. What matters most is how kind your heart is.\"" },
          { prompt: "When they want what others have", example: "\"I understand wanting what others have — I feel that sometimes too. But having more stuff doesn't make anyone happier. Let's think about what makes YOU truly happy.\"" }
        ]
      },
      {
        id: "body-awareness",
        emoji: "🫣",
        title: "Early Body Awareness & Confusion",
        description: "Between ages 5–10, children become curious about their bodies and others'. They may ask uncomfortable questions, peek, or touch themselves. This is developmentally normal but requires calm, clear guidance — not shame or punishment.",
        signs: [
          "Asks questions like \"Why do boys and girls look different?\"",
          "Shows curiosity about body parts during bath time or changing",
          "Giggles or gets embarrassed when body topics come up",
          "Tries to peek at others changing clothes",
          "Uses crude words they heard from peers"
        ],
        hiddenBehaviors: [
          "Touches themselves in private but becomes extremely ashamed if caught",
          "Becomes secretive about bathroom visits",
          "Draws body parts and hides the drawings",
          "Asks older kids questions instead of parents (risky source of info)",
          "Starts using words they don't understand but heard at school"
        ],
        howToRespond: [
          "Stay calm — your reaction sets the tone. Shame creates secrecy",
          "Use correct anatomical terms naturally: penis, vagina, chest, etc.",
          "Explain privacy: \"Your body is yours. It's normal to be curious, but we explore in private\"",
          "Answer questions honestly at age-appropriate levels",
          "Keep the door open: \"You can always ask me anything about your body\""
        ],
        howToTalk: [
          { prompt: "When they ask about body differences", example: "\"Boys and girls have different body parts, and that's completely normal. Each body is special. Do you have any other questions? I'm happy to explain.\"" },
          { prompt: "When caught touching themselves", example: "\"That's your private body, and it's okay to be curious. But that's something we do in private, not in front of others. It's nothing to be ashamed of.\"" },
          { prompt: "Introducing the concept of privacy", example: "\"Some parts of our body are private — that means they're just for us. Nobody should touch those parts, and you don't need to show them to anyone.\"" }
        ]
      },
      {
        id: "personal-boundaries",
        emoji: "🚧",
        title: "Learning Personal Boundaries",
        description: "Boundaries aren't just physical — they're emotional too. Children need to learn that they can say no, that their body and feelings matter, and that other people's boundaries deserve respect too. This is foundational for preventing abuse and building healthy relationships.",
        signs: [
          "Doesn't understand when others say \"stop\" or \"no\"",
          "Gets too close to people physically (hugging strangers, sitting on laps)",
          "Doesn't assert themselves when uncomfortable",
          "Lets other kids boss them around without pushback",
          "Touches others' belongings without asking"
        ],
        hiddenBehaviors: [
          "Allows older kids or adults to cross boundaries because they want approval",
          "Feels guilty saying \"no\" to anyone, including adults",
          "Gives away personal items when pressured",
          "Tolerates being tickled or hugged even when visibly uncomfortable",
          "Doesn't tell parents when someone makes them uncomfortable"
        ],
        howToRespond: [
          "Teach them that \"No\" is a complete sentence — they don't need to justify it",
          "Never force hugs or kisses with relatives: \"Do you want to hug Grandma, or would you prefer a wave?\"",
          "Model boundaries yourself: \"I need 10 minutes alone right now\"",
          "Practice scenarios: \"What would you say if someone took your toy without asking?\"",
          "Validate their boundary-setting: \"I'm proud of you for telling them to stop\""
        ],
        howToTalk: [
          { prompt: "Teaching them to say no", example: "\"If someone does something that makes you uncomfortable — even a friend, even a grown-up — you can say 'Please stop, I don't like that.' And if they don't stop, come tell me right away.\"" },
          { prompt: "Respecting others' boundaries", example: "\"Just like you don't want people taking your things, other people feel the same way. Always ask before touching someone else's stuff — and respect their answer.\"" },
          { prompt: "Body autonomy", example: "\"Your body belongs to you. You never have to hug or kiss anyone you don't want to — not even family members. A smile or a wave is perfectly okay.\"" }
        ]
      },
      {
        id: "good-touch-bad-touch",
        emoji: "🛡️",
        title: "Good Touch vs Bad Touch Awareness",
        description: "This is one of the most critical conversations a parent can have. Many children don't have the vocabulary to describe abuse. Teaching them the difference between safe and unsafe touch — without inducing fear — empowers them to protect themselves and speak up.",
        signs: [
          "Child suddenly becomes afraid of a specific person or place",
          "Regression: bedwetting, thumb-sucking, or baby talk after outgrowing it",
          "Refuses to be alone with a particular adult or older child",
          "Sudden knowledge of sexual acts beyond their age",
          "Becomes extremely clingy or, conversely, very withdrawn"
        ],
        hiddenBehaviors: [
          "Uses stuffed animals or dolls to act out inappropriate scenarios",
          "Says things like \"It's our secret\" when talking about an adult",
          "Becomes hyper-vigilant about locking doors",
          "Draws disturbing images involving body parts",
          "Flinches when touched, even gently"
        ],
        howToRespond: [
          "Teach the underwear rule: \"The parts covered by your underwear are private\"",
          "Explain three types of touch: safe (hugs from parents), unsafe (touches that hurt or feel wrong), and unwanted (touches you simply don't want)",
          "Make it clear: \"No adult should ever ask you to keep a touch a secret\"",
          "Create a safety list: 3 trusted adults they can tell if something happens",
          "Stay calm if they disclose — your reaction determines if they'll tell you again",
          "Believe them. Always. Then take action."
        ],
        howToTalk: [
          { prompt: "Introducing the concept", example: "\"There are good touches — like hugs from me, a doctor checking your heart. And there are bad touches — when someone touches your private parts or makes you feel scared or confused. If that ever happens, you tell me immediately. You will NEVER be in trouble.\"" },
          { prompt: "About secrets", example: "\"Surprises are fun — like a birthday gift. But secrets that make you feel bad inside are NEVER okay. If anyone — a teacher, relative, friend — tells you to keep a secret about touching, that's a bad secret. You must tell me.\"" },
          { prompt: "If they disclose something", example: "\"Thank you so much for telling me. You are so brave. This is NOT your fault. I believe you, and I will make sure you are safe. You did the right thing by telling me.\"" }
        ]
      },
      {
        id: "inappropriate-content",
        emoji: "📱",
        title: "Accidental Exposure to Inappropriate Content",
        description: "Even with parental controls, children can accidentally see violent, sexual, or disturbing content through ads, older siblings' devices, friends' phones, or pop-ups. How you react determines whether they come to you next time — or hide it.",
        signs: [
          "Suddenly secretive about their device usage",
          "Asks advanced questions about sex, violence, or drugs",
          "Has nightmares or becomes unusually anxious",
          "Repeats phrases or mimics behaviors they couldn't have learned at school",
          "Quickly switches screens when a parent walks by"
        ],
        hiddenBehaviors: [
          "Searches for related content out of confusion or curiosity after initial exposure",
          "Shares what they saw with friends but not parents",
          "Acts out what they saw through play or drawings",
          "Develops irrational fears (e.g., afraid someone will break in after seeing violence)",
          "Becomes unusually interested in or afraid of romantic/physical contact"
        ],
        howToRespond: [
          "Don't panic or punish — they didn't choose to see it",
          "Ask what they saw calmly: \"Can you tell me what you saw? I won't be angry\"",
          "Explain that what they saw isn't how real life works",
          "Use it as a learning moment: \"That video showed people being hurt. In real life, we never treat people that way\"",
          "Review device settings together — make it collaborative, not punitive",
          "Check in a few days later: \"Have you been thinking about what you saw?\""
        ],
        howToTalk: [
          { prompt: "When you discover they saw something", example: "\"I know you saw something that might have confused or scared you. It's not your fault. Can you tell me what you saw? I promise I won't be angry — I want to help you understand it.\"" },
          { prompt: "Explaining the content", example: "\"What you saw was made for adults, and it doesn't show how real people behave. Real love is kind and respectful. Real strength is about helping, not hurting.\"" },
          { prompt: "Setting future expectations", example: "\"If you ever see something online that makes you feel weird, scared, or confused — close it and come tell me. You won't get in trouble. I'd rather you tell me than try to understand it alone.\"" }
        ]
      },
      {
        id: "aggressive-behavior",
        emoji: "😤",
        title: "Copying Aggressive or Disrespectful Behavior",
        description: "Children absorb behavior from their environment — TV, school, family, and social media. When they see aggression, rudeness, or disrespect get results (laughter, attention, dominance), they mimic it. This isn't \"bad character\" — it's learned behavior that can be unlearned.",
        signs: [
          "Uses rude language they didn't learn at home",
          "Hits, pushes, or kicks during play or frustration",
          "Talks back to parents or teachers with a hostile tone",
          "Imitates characters from shows or games that use violence",
          "Laughs when someone gets hurt"
        ],
        hiddenBehaviors: [
          "Is actually scared and uses aggression as a defense mechanism",
          "Feels powerless at school and uses aggression at home to feel in control",
          "Is being bullied and mimics the bully's behavior",
          "Sees a parent or family member being aggressive and normalizes it",
          "Tests boundaries to see what reaction they'll get"
        ],
        howToRespond: [
          "Address the behavior, not the child: \"That behavior is not okay\" — not \"You're a bad kid\"",
          "Identify the source: Is it a show, a friend, a family member?",
          "Set clear, calm consequences: \"When we hit, we take a break to cool down\"",
          "Teach alternatives: \"When you're angry, you can stomp your feet, squeeze a pillow, or tell me\"",
          "Model calm conflict resolution in your own relationships",
          "Limit exposure to violent or disrespectful media content"
        ],
        howToTalk: [
          { prompt: "Addressing the behavior", example: "\"I saw you push your sister. I know you were upset, but pushing hurts people. How were you feeling when that happened? Let's find a better way to handle that feeling.\"" },
          { prompt: "Discussing media influence", example: "\"I noticed you're copying what that character does in the show. But that character isn't real — and in real life, being mean to people makes them feel terrible. We can be funny without being hurtful.\"" },
          { prompt: "When they talk back", example: "\"I can hear you're frustrated, and I want to understand why. But speaking to me that way isn't how we talk to each other in this family. Take a breath, then tell me what's really bothering you.\"" }
        ]
      },
      {
        id: "right-wrong-actions",
        emoji: "⚖️",
        title: "Understanding Right vs Wrong Through Actions",
        description: "Children don't learn morality from lectures — they learn it from what they see, what's rewarded, and what happens when rules are broken. Consistency between what you say and what you do is the single most powerful moral teacher.",
        signs: [
          "Says \"But you do it too!\" when corrected",
          "Lies to avoid punishment even for small things",
          "Doesn't understand why cheating or stealing is wrong if nobody gets caught",
          "Does the right thing only when watched",
          "Struggles with empathy — doesn't understand others' pain"
        ],
        hiddenBehaviors: [
          "Watches parents closely for inconsistencies (and remembers them)",
          "Believes rules only apply when adults are present",
          "Thinks being \"smart\" means getting away with things",
          "Justifies wrong actions: \"Everyone does it\"",
          "Feels confused when different adults have different rules"
        ],
        howToRespond: [
          "Be consistent: if lying is wrong for them, don't lie in front of them (even white lies)",
          "Explain the WHY behind rules, not just the rule itself",
          "Use natural consequences: \"You broke your sister's toy, so you'll help fix it or replace it from your savings\"",
          "Praise honesty even when the truth is inconvenient: \"Thank you for telling me. That was brave\"",
          "Read stories together that explore moral dilemmas and discuss them",
          "Apologize when YOU make mistakes — it teaches accountability"
        ],
        howToTalk: [
          { prompt: "When they lie", example: "\"I know it's scary to tell the truth sometimes because you think you'll get in trouble. But I will always be less upset about the truth than about a lie. Honesty is one of the most important things in our family.\"" },
          { prompt: "Teaching empathy", example: "\"Imagine if someone did that to you — how would you feel? That feeling you're imagining right now? That's exactly how [name] felt. That's why we need to be kind.\"" },
          { prompt: "When they see you make a mistake", example: "\"I messed up today — I said something unkind and I feel bad about it. I'm going to apologize. Even parents make mistakes, but what matters is that we own up to them.\"" }
        ]
      },
      {
        id: "inclusivity",
        emoji: "🌍",
        title: "Inclusivity for All",
        description: "Children aren't born with prejudice — they learn it. Between ages 5–12, they begin noticing differences: skin color, disability, wealth, religion, and family structures. How you address these observations shapes whether they grow up with empathy or bias.",
        signs: [
          "Makes comments like \"Why is that person in a wheelchair?\" or \"Why is their skin different?\"",
          "Refuses to play with a child who looks or acts differently",
          "Repeats stereotypes heard from peers or media",
          "Shows discomfort around people with disabilities",
          "Judges others based on their clothes, lunch, or possessions"
        ],
        hiddenBehaviors: [
          "Excludes certain children without overtly saying why",
          "Uses words like \"weird\" or \"strange\" for people who are different",
          "Associates poverty with being \"bad\" or wealth with being \"good\"",
          "Feels superior because of their family's status, appearance, or background",
          "Avoids asking questions for fear of being scolded, so assumptions go uncorrected"
        ],
        howToRespond: [
          "Welcome their questions — curiosity is not rudeness",
          "Expose them to diversity: books, shows, neighborhoods, friendships with people from different backgrounds",
          "Explain differences matter-of-factly: \"Some people use wheelchairs to move around. It's just how they travel — like how you use your bike\"",
          "Address stereotypes directly: \"That's a stereotype — it means judging all people in a group the same way, which isn't fair\"",
          "Examine your own biases — children mirror your attitudes",
          "Teach that wealth and poverty don't define a person's worth"
        ],
        howToTalk: [
          { prompt: "When they notice skin color", example: "\"People come in all different shades — like flowers in a garden. Our skin color is just one part of who we are. What really matters is how we treat each other.\"" },
          { prompt: "When they encounter disability", example: "\"[Name] uses a wheelchair because their legs work differently. But they can do tons of amazing things — just like you can't fly, but you're still awesome. Everyone has strengths and challenges.\"" },
          { prompt: "When they judge based on wealth", example: "\"Having expensive things doesn't make someone better. Some of the kindest, smartest people don't have a lot of money. We respect people for who they are, not what they own.\"" },
          { prompt: "When they encounter different family structures", example: "\"Families come in all shapes — some have two moms, some have one parent, some live with grandparents. What makes a family is love, not what it looks like.\"" }
        ]
      }
    ]
  },
  {
    id: "13-16",
    label: "Ages 13–16",
    emoji: "🧑‍🎓",
    color: "from-violet-500 to-purple-600",
    guides: [
      {
        id: "crushes-attraction",
        emoji: "💘",
        title: "Crushes, Attraction & Confusion About Love",
        description: "Teenagers experience intense emotions around attraction for the first time. Crushes feel all-consuming. Rejection feels devastating. They confuse infatuation with love, and many don't understand the difference between healthy attraction and obsession. This is when foundations for future relationships are set.",
        signs: [
          "Constantly talks about (or deliberately avoids mentioning) a specific person",
          "Sudden interest in appearance — new clothes, hairstyles, grooming",
          "Mood swings tied to interactions with their crush",
          "Becomes secretive about their phone or messages",
          "Grades or interests suddenly shift"
        ],
        hiddenBehaviors: [
          "Writes about their crush in hidden notes or private social media accounts",
          "Compares themselves to their crush's other friends or perceived \"competition\"",
          "Stays up late texting or overthinking conversations",
          "Feels physical symptoms: stomachaches, inability to eat, racing heart",
          "May begin to change their personality, hobbies, or beliefs to impress their crush"
        ],
        howToRespond: [
          "Don't tease or dismiss: \"Oh, you have a GIRLFRIEND?\" makes them shut down",
          "Normalize the experience: \"Crushes are a natural part of growing up\"",
          "Teach the difference between crush, love, and obsession",
          "Discuss healthy relationship traits: respect, trust, communication, space",
          "Set boundaries around dating that are age-appropriate, not punitive",
          "Share your own teenage crush stories — it builds connection"
        ],
        howToTalk: [
          { prompt: "Opening the topic", example: "\"I've noticed you seem a bit distracted lately — and that's totally okay. Is there someone on your mind? You don't have to tell me who, but I'm here if you want to talk about how you're feeling.\"" },
          { prompt: "Teaching about healthy relationships", example: "\"Real love isn't about butterflies all the time. It's about someone who respects your boundaries, supports your goals, and doesn't make you feel like you have to change who you are.\"" },
          { prompt: "After rejection", example: "\"Rejection hurts — I've been there too. It doesn't mean there's anything wrong with you. It just means it wasn't the right match. The right person will appreciate exactly who you are.\"" }
        ]
      },
      {
        id: "religion-discrimination",
        emoji: "🕊️",
        title: "Religion-Based Discrimination",
        description: "Teenagers encounter religious diversity and, with it, prejudice — both receiving and witnessing it. They may face mockery for their beliefs, pressure to conform, or develop biases against other religions. Understanding religious tolerance is essential for building character and preventing radicalization.",
        signs: [
          "Comes home upset about comments made about their religion or beliefs",
          "Starts mocking other religions or using derogatory terms",
          "Questions their own faith aggressively due to peer influence",
          "Refuses to participate in family religious practices without explanation",
          "Becomes either extremely rigid or completely dismissive about religion"
        ],
        hiddenBehaviors: [
          "Hides religious identity at school to avoid bullying",
          "Joins online groups with extreme religious or anti-religious views",
          "Feels shame about family traditions or cultural practices",
          "Bullies other kids based on their religion without parents knowing",
          "Internalizes that their religion makes them \"inferior\" or \"superior\""
        ],
        howToRespond: [
          "Teach respect for all faiths without undermining your own",
          "Explain that religion is personal — no one should force or mock anyone's beliefs",
          "Expose them to diverse perspectives through books, documentaries, and conversations",
          "Address hate speech immediately: \"We don't judge people by their religion\"",
          "Allow them to question faith — it strengthens genuine belief",
          "Be honest about historical injustices caused by religious extremism on all sides"
        ],
        howToTalk: [
          { prompt: "When they face discrimination", example: "\"What happened to you is wrong. No one has the right to make you feel bad about your beliefs. Your faith is part of who you are, and you should be proud — not ashamed.\"" },
          { prompt: "When they discriminate against others", example: "\"Making fun of someone's religion is the same as making fun of their family. Would you want someone doing that to us? Every family has their own beliefs, and we respect that.\"" },
          { prompt: "When they question their own faith", example: "\"Questioning is healthy — it means you're thinking deeply. You don't have to have all the answers right now. What matters is that whatever you believe, it makes you a kinder person.\"" }
        ]
      },
      {
        id: "consent-boundaries",
        emoji: "✋",
        title: "Understanding Consent & Boundaries",
        description: "Consent isn't just about sex — it's about respecting someone's right to say yes or no to anything involving their body, space, or personal information. Teenagers need to understand both giving and receiving consent in friendships, relationships, and digital spaces.",
        signs: [
          "Doesn't ask before borrowing or using others' things",
          "Shares friends' secrets or photos without permission",
          "Gets upset when someone says no to physical contact",
          "Pressures friends into doing things they're uncomfortable with",
          "Doesn't recognize when someone is uncomfortable"
        ],
        hiddenBehaviors: [
          "Forwards private messages or photos without thinking",
          "Feels entitled to physical affection from a partner",
          "Doesn't realize that pressuring someone isn't \"convincing\" — it's coercion",
          "Allows their own boundaries to be violated because they don't know they can say no",
          "Interprets silence as consent"
        ],
        howToRespond: [
          "Teach that consent must be enthusiastic, informed, ongoing, and freely given",
          "Explain that consent applies to everything: hugs, photos, sharing information, and physical contact",
          "Use everyday examples: \"Did you ask before posting that group photo?\"",
          "Discuss the concept of coercion vs. genuine agreement",
          "Make it clear: being in a relationship doesn't equal automatic consent",
          "Teach them to check in: \"Is this okay?\" should feel natural, not awkward"
        ],
        howToTalk: [
          { prompt: "Introducing consent", example: "\"Consent means making sure the other person genuinely wants to do something — not just going along with it because they feel pressured. It applies to everything, from sharing photos to physical touch.\"" },
          { prompt: "About their own boundaries", example: "\"You always have the right to say no — to anyone, about anything involving your body or personal space. No one is allowed to make you feel guilty for setting a boundary.\"" },
          { prompt: "About respecting others", example: "\"If someone hesitates, changes the subject, or says 'I don't know,' that's not a yes. A real yes is clear and comfortable. Always ask, and always respect the answer.\"" }
        ]
      },
      {
        id: "body-image",
        emoji: "💪",
        title: "Body Image Issues & Body Shaming",
        description: "Teenagers are bombarded with unrealistic body standards through social media, advertising, and peer culture. Body shaming — from others or self-inflicted — can lead to eating disorders, depression, self-harm, and lifelong insecurity. Both boys and girls are affected.",
        signs: [
          "Constantly criticizes their own body in the mirror",
          "Skips meals, adopts extreme diets, or exercises obsessively",
          "Refuses to wear swimsuits, shorts, or anything revealing",
          "Compares their body to influencers, celebrities, or peers constantly",
          "Makes negative comments about others' bodies"
        ],
        hiddenBehaviors: [
          "Uses apps to edit their photos before posting",
          "Weighs themselves multiple times a day",
          "Hides food or eats secretly",
          "Follows \"thinspo\" or \"fitspiration\" accounts with extreme content",
          "Wears baggy clothes exclusively to hide their body"
        ],
        howToRespond: [
          "Never comment on their weight — positive or negative",
          "Don't diet in front of them or call food \"good\" or \"bad\"",
          "Emphasize what their body CAN DO, not how it looks",
          "Discuss media literacy: show them how photos are edited and filtered",
          "If you suspect an eating disorder, seek professional help immediately",
          "Model body acceptance: stop criticizing your own body in front of them"
        ],
        howToTalk: [
          { prompt: "When they criticize their body", example: "\"I hear you saying negative things about your body, and I want you to know — your body is not the enemy. It carries you, lets you hug people you love, and does incredible things every day.\"" },
          { prompt: "About social media vs reality", example: "\"Most of what you see online is filtered, posed, and edited. Even the people in those photos don't look like that in real life. Comparing yourself to an illusion will always make you feel bad.\"" },
          { prompt: "When they body-shame others", example: "\"Making comments about someone's body — even as a joke — can cause real damage. You never know what someone is going through. Let's be the kind of people who lift others up.\"" }
        ]
      },
      {
        id: "puberty-confusion",
        emoji: "🌱",
        title: "Puberty-Related Confusion & Embarrassment",
        description: "Puberty hits at different times for different children, causing enormous anxiety. Early bloomers feel exposed; late bloomers feel left behind. Voice changes, acne, growth spurts, body odor, and mood swings create a storm of embarrassment. Silence from parents makes it worse.",
        signs: [
          "Becomes extremely private — locks bathroom door, refuses to change in locker rooms",
          "Suddenly self-conscious about body odor or appearance",
          "Voice cracks cause visible embarrassment",
          "Compares their development to peers",
          "Asks vague questions or searches online for answers"
        ],
        hiddenBehaviors: [
          "Feels \"broken\" because they're developing faster or slower than peers",
          "Avoids physical education or sports due to body changes",
          "Uses deodorant, perfume, or makeup excessively to mask changes",
          "Boys may feel confused by unexpected erections or wet dreams",
          "Girls may hide menstruation products or feel intense shame"
        ],
        howToRespond: [
          "Initiate the conversation before puberty begins — waiting until it starts is too late",
          "Normalize everything: \"This happens to every single person\"",
          "Provide practical supplies without making it a big deal",
          "Separate biological facts from emotional support — they need both",
          "Don't tease about voice changes, acne, or growth spurts",
          "Offer a book or resource they can explore privately in addition to talking"
        ],
        howToTalk: [
          { prompt: "Opening the puberty conversation", example: "\"Your body is going to change a lot over the next few years — and that's 100% normal. I want you to know you can ask me anything without feeling embarrassed. I went through it too.\"" },
          { prompt: "About being early or late", example: "\"Everyone's body has its own timeline. Some kids develop earlier, some later — and both are perfectly normal. There's no 'right' time. Your body knows what it's doing.\"" },
          { prompt: "About embarrassing moments", example: "\"I know [voice cracks / acne / growth spurts] can feel embarrassing. But every adult you see went through the exact same thing. It's temporary, and it's a sign your body is growing the way it should.\"" }
        ]
      },
      {
        id: "menstruation-changes",
        emoji: "🩸",
        title: "Menstruation & Bodily Changes (Normalization)",
        description: "Menstruation remains one of the most stigmatized natural processes. Many girls feel shame, and many boys grow up clueless or mocking. Parents — especially fathers — play a critical role in normalizing periods. This isn't just a \"mother's talk\" — it's a family understanding.",
        signs: [
          "Girl becomes anxious or moody around a predictable monthly cycle",
          "Hides period products or is embarrassed to ask for them",
          "Boys make jokes about periods at school",
          "Avoids swimming, sports, or activities during menstruation",
          "Expresses confusion about cramps, flow, or why this happens"
        ],
        hiddenBehaviors: [
          "Uses excessive toilet paper instead of proper products because she's embarrassed to ask",
          "Misses school during periods due to shame, not just pain",
          "Believes myths: periods are dirty, you can't exercise, you're \"impure\"",
          "Boys develop disgust towards menstruation and carry it into adulthood",
          "Girls feel they can't discuss it with their father"
        ],
        howToRespond: [
          "Stock period products openly at home — not hidden away",
          "Fathers: buy pads/tampons for your daughter. It normalizes it instantly",
          "Educate sons about menstruation with the same openness as daughters",
          "Never use phrases like \"Is it that time of the month?\" to dismiss emotions",
          "Track symptoms together and help manage discomfort with warmth and care",
          "Celebrate the milestone if your daughter is comfortable with it"
        ],
        howToTalk: [
          { prompt: "For daughters", example: "\"Getting your period means your body is healthy and growing. It's something to understand, not be ashamed of. I've got supplies for you, and we can talk about what to expect.\"" },
          { prompt: "For sons", example: "\"Women and girls go through something called menstruation every month. It's a normal body process, not a joke. Respecting it is part of being a good person — and one day, your partner will appreciate that you understand.\"" },
          { prompt: "For fathers specifically", example: "\"I know it might feel awkward talking about this with me, but I want you to know — I'm not embarrassed, and you shouldn't be either. I can buy you whatever you need. This is totally normal.\"" }
        ]
      },
      {
        id: "sexual-content",
        emoji: "🔞",
        title: "Exposure to Sexual Content or Misinformation",
        description: "By age 13, most teenagers have been exposed to pornography or sexual content — usually accidentally. This creates distorted views of sex, consent, body expectations, and relationships. Silence from parents leaves the internet as their primary sex educator.",
        signs: [
          "Suddenly secretive about device usage, clears browser history",
          "Uses sexual language or jokes beyond their age level",
          "Asks advanced questions about sex, but seems uncomfortable",
          "Becomes anxious about their own body's \"normality\"",
          "Shows change in how they talk about or treat the opposite gender"
        ],
        hiddenBehaviors: [
          "Believes pornography represents real sex and real relationships",
          "Feels inadequate because their body doesn't match what they've seen",
          "Shares explicit content with friends to seem \"cool\"",
          "Develops anxiety about sexual performance long before it's relevant",
          "Confuses aggressive sexual behavior in media with normal attraction"
        ],
        howToRespond: [
          "Don't punish — they didn't create the internet. Instead, educate",
          "Explain that pornography is to real relationships what action movies are to real fights — exaggerated and fake",
          "Discuss what healthy, consensual intimacy actually looks like",
          "Address body expectations: real bodies don't look like what's on screen",
          "Use age-appropriate resources for sex education — recommend books or videos",
          "Keep the conversation ongoing, not a one-time \"talk\""
        ],
        howToTalk: [
          { prompt: "Discovering they've seen content", example: "\"I know you've probably seen things online that were sexual or confusing. I'm not angry — this is really common. But I want you to know that what's shown online is NOT how real relationships work. Can we talk about what real respect and intimacy mean?\"" },
          { prompt: "About pornography specifically", example: "\"Pornography is made for entertainment, not education. It doesn't show real consent, real bodies, or real emotions. If you're curious about how relationships work, I'd rather you ask me or read something trustworthy.\"" },
          { prompt: "About body expectations", example: "\"Real bodies come in all shapes and sizes. What you see online is often surgically altered or digitally enhanced. Your body — exactly as it is — is completely normal.\"" }
        ]
      },
      {
        id: "identity-confusion",
        emoji: "🧩",
        title: "Identity Confusion & Self-Doubt",
        description: "The teenage years are defined by the question \"Who am I?\" Teens try on different identities — changing friend groups, interests, beliefs, style, and even values. This can feel alarming to parents, but it's a necessary part of development. The danger is when self-doubt becomes self-hatred.",
        signs: [
          "Dramatically changes style, music taste, or friend group",
          "Says things like \"I don't know who I am\" or \"Nothing feels right\"",
          "Withdraws from activities they used to love",
          "Becomes unusually philosophical or nihilistic",
          "Expresses existential anxiety: \"What's the point?\""
        ],
        hiddenBehaviors: [
          "Creates alternate personas online (different name, personality)",
          "Feels like a \"fraud\" — impostor syndrome in social settings",
          "Suppresses their real interests to fit in with a group",
          "Compares their \"behind the scenes\" to everyone else's \"highlight reel\"",
          "Privately journals dark or confused thoughts without sharing"
        ],
        howToRespond: [
          "Don't panic when they change — it's exploration, not destruction",
          "Express unconditional love: \"No matter who you become, I love you\"",
          "Encourage them to try things without pressure to commit",
          "Share your own teenage identity struggles — it normalizes the process",
          "Watch for prolonged withdrawal or hopelessness — this may need professional support",
          "Give them space but stay present: \"I'm here when you need me\""
        ],
        howToTalk: [
          { prompt: "When they seem lost", example: "\"It's completely normal to not know who you are yet. You're not supposed to have it figured out at [age]. Life is about discovering yourself — and that takes time. I'm still learning about myself too.\"" },
          { prompt: "When they change drastically", example: "\"I've noticed you're really into [new interest/style]. That's cool — tell me about it. I might not understand it, but I want to know what excites you.\"" },
          { prompt: "When they express self-doubt", example: "\"Feeling like you don't fit in is one of the hardest things. But I want you to know — you don't have to fit into anyone's box. The people worth knowing will love you for exactly who you are.\"" }
        ]
      },
      {
        id: "cyberbullying",
        emoji: "💻",
        title: "Cyberbullying & Online Harassment",
        description: "Unlike schoolyard bullying, cyberbullying follows children home. It's 24/7, often anonymous, and can spread instantly. Screenshots live forever. Teens may not tell parents because they fear losing their devices. The psychological damage can be severe — including anxiety, depression, and in extreme cases, self-harm.",
        signs: [
          "Becomes visibly upset during or after using their phone",
          "Suddenly deletes social media accounts or goes unusually quiet online",
          "Doesn't want to go to school or social events",
          "Sleep disturbances — staying up late monitoring messages",
          "Unexplained anger, crying, or withdrawal"
        ],
        hiddenBehaviors: [
          "Doesn't report it because they fear having their phone taken away",
          "Retaliates online, escalating the situation",
          "Creates fake accounts to spy on or confront the bully",
          "Blames themselves: \"I deserve it\" or \"I started it\"",
          "Screenshots and obsesses over hurtful messages repeatedly"
        ],
        howToRespond: [
          "Promise that you won't take away their devices as a first response — fear of this stops them from telling you",
          "Document everything: screenshots, dates, usernames",
          "Report to the platform and, if threatening, to the school or authorities",
          "Don't tell them to \"just ignore it\" — that minimizes real pain",
          "Help them block the person and secure their accounts",
          "Consider professional support if the bullying has been prolonged"
        ],
        howToTalk: [
          { prompt: "Opening the conversation", example: "\"I've noticed you seem really stressed after being on your phone. If someone is being mean to you online, I want to help — and I promise my first reaction won't be to take your phone away.\"" },
          { prompt: "If they're being bullied", example: "\"What's happening to you is not okay, and it's not your fault. People who bully online are usually dealing with their own pain. That doesn't excuse it. Let's figure out how to handle this together.\"" },
          { prompt: "If they're the bully", example: "\"I've found out that you've been saying hurtful things to someone online. I need to understand why. Hurting someone through a screen is the same as hurting them in person. How would you feel if someone did this to you?\"" }
        ]
      },
      {
        id: "risky-behaviors",
        emoji: "🚬",
        title: "Risky Behaviors Influenced by Peers",
        description: "Teenage brains are wired for risk-taking and social acceptance. Peer pressure to smoke, vape, drink, skip school, shoplift, or engage in rebellious behavior is intense. Teens don't do these things because they're \"bad\" — they do them because belonging feels like survival at that age.",
        signs: [
          "New friend group that they're secretive about",
          "Comes home smelling different (smoke, alcohol, strong perfume to cover up)",
          "Money goes missing or they suddenly have things they can't explain",
          "Grades drop sharply without academic explanation",
          "Becomes defensive when asked about their activities"
        ],
        hiddenBehaviors: [
          "Tries substances once out of curiosity but is terrified of getting caught",
          "Covers for friends who are engaging in risky behavior",
          "Feels trapped: wants to stop but fears losing their friend group",
          "Justifies it: \"Everyone does it\" or \"It's not a big deal\"",
          "Uses social media to document risky behavior for peer validation"
        ],
        howToRespond: [
          "Keep communication channels open — teens who fear punishment don't ask for help",
          "Have a \"no questions asked\" pickup policy: \"Call me anytime, from anywhere, and I'll come get you\"",
          "Discuss peer pressure openly: \"Sometimes the hardest thing is saying no to friends\"",
          "Share real consequences without scare tactics — facts work better than fear",
          "Help them develop exit strategies: \"What could you say if someone offers you a cigarette?\"",
          "Know their friends — invite them over, observe the dynamics"
        ],
        howToTalk: [
          { prompt: "About peer pressure", example: "\"I know how hard it is to say no when everyone around you is doing something. But the people who pressure you into doing things you're uncomfortable with aren't protecting you — they're using you. Real friends respect your choices.\"" },
          { prompt: "If you discover substance use", example: "\"I found [item] and we need to talk about it. I'm not going to scream at you — but I need to understand what's going on. Are you safe? Is someone pressuring you? Let's work through this together.\"" },
          { prompt: "Creating a safety net", example: "\"I want you to know something: if you're ever in a situation that feels dangerous or wrong — a party, a car with someone who's been drinking, anything — text me the word '[code word]' and I will come get you. No anger. No lecture that night. Your safety comes first, always.\"" }
        ]
      }
    ]
  }
];
