export const quizData = [
  {
    id: 1,
    title: "Quitting Activities",
    question: "Your child wants to quit their piano lessons midway through the term. They say it's 'too hard' and 'boring'. What do you do?",
    options: [
      { id: "a", text: "Let them quit immediately - forcing won't help", value: "quit" },
      { id: "b", text: "Make them finish the term, then decide", value: "finish" },
      { id: "c", text: "Explore what's making it hard and find solutions together", value: "explore" },
      { id: "d", text: "Bribe them with rewards to continue", value: "bribe" }
    ],
    bestAnswer: "explore",
    feedback: {
      explore: "Excellent! This approach validates their feelings while problem-solving together. You might discover they need more practice time, a different teaching style, or just encouragement through a difficult phase.",
      finish: "Good thinking about commitment, but consider exploring the root cause first. Sometimes 'boring' or 'hard' signals a need for different support rather than pure perseverance.",
      quit: "While avoiding force is good, immediately quitting might miss learning opportunities about working through challenges and finding solutions.",
      bribe: "Rewards might work short-term but don't address the underlying issue and can create dependency on external motivation."
    },
    insight: "Teaching problem-solving skills helps children handle future challenges independently."
  },
  {
    id: 2,
    title: "Emotional Expression",
    question: "Your son starts crying during a sad movie scene. Other family members say 'boys don't cry.' How do you respond?",
    options: [
      { id: "a", text: "Agree and tell him to toughen up", value: "agree" },
      { id: "b", text: "Ignore the comment and comfort your son", value: "comfort" },
      { id: "c", text: "Address the comment and validate his emotions publicly", value: "validate" },
      { id: "d", text: "Take him away from the situation", value: "remove" }
    ],
    bestAnswer: "validate",
    feedback: {
      validate: "Perfect! You're modeling emotional intelligence and challenging harmful gender stereotypes. This teaches everyone that emotions are human, not gendered.",
      comfort: "Good instinct to comfort, but addressing the harmful comment is important too. This is a teaching moment for everyone present.",
      agree: "This reinforces harmful stereotypes and teaches children to suppress emotions, which can lead to mental health issues later.",
      remove: "While protecting your child's feelings, this misses the opportunity to educate and normalize emotional expression for everyone."
    },
    insight: "Emotional expression is healthy regardless of gender. Modeling this teaches emotional intelligence."
  },
  {
    id: 3,
    title: "Gender Role Expectations",
    question: "Your daughter refuses to wear a dress to a family wedding, preferring her dinosaur shirt and shorts. Your partner insists she 'dress like a girl.' What do you do?",
    options: [
      { id: "a", text: "Force her to wear the dress to keep peace", value: "force" },
      { id: "b", text: "Find a compromise like a dress with dinosaurs", value: "compromise" },
      { id: "c", text: "Support her choice and discuss with your partner privately", value: "support" },
      { id: "d", text: "Let your partner handle it", value: "avoid" }
    ],
    bestAnswer: "support",
    feedback: {
      support: "Excellent! You're respecting her autonomy and sense of self while addressing the conflict constructively. This teaches her that her preferences matter and that she has bodily autonomy.",
      compromise: "Good problem-solving, but be careful not to always compromise on a child's personal expression. Sometimes standing firm on their autonomy is important.",
      force: "This teaches children that others' opinions matter more than their own comfort and self-expression, which can impact self-esteem and decision-making skills.",
      avoid: "Avoiding the situation doesn't help your child feel supported and may send the message that their preferences don't matter to you."
    },
    insight: "Supporting children's self-expression builds confidence and teaches them to trust their own judgment."
  },
  {
    id: 4,
    title: "Sharing vs. Boundaries",
    question: "Your 4-year-old doesn't want to share their favorite toy with a visiting cousin. The cousin is crying. What's your approach?",
    options: [
      { id: "a", text: "Force them to share - it's the polite thing to do", value: "force" },
      { id: "b", text: "Explain that some things can be special and help find alternatives", value: "boundaries" },
      { id: "c", text: "Distract both children with a different activity", value: "distract" },
      { id: "d", text: "Take the toy away from both children", value: "remove" }
    ],
    bestAnswer: "boundaries",
    feedback: {
      boundaries: "Wonderful! You're teaching that it's okay to have boundaries while being kind. This helps children understand consent and respect for personal belongings while developing empathy.",
      distract: "This can work in the moment but misses the teaching opportunity about boundaries, sharing, and problem-solving.",
      force: "Forced sharing can teach children that their boundaries don't matter and that they must give up their things to please others, which can be problematic later.",
      remove: "This punishes both children and doesn't teach problem-solving or respect for boundaries and ownership."
    },
    insight: "Teaching healthy boundaries is as important as teaching generosity and sharing."
  },
  {
    id: 5,
    title: "Academic Pressure",
    question: "Your child brings home a B+ on a test they studied hard for. They seem disappointed. How do you respond?",
    options: [
      { id: "a", text: "Tell them a B+ is great and they should be happy", value: "dismiss" },
      { id: "b", text: "Ask what they think they could do differently next time", value: "improve" },
      { id: "c", text: "Acknowledge their disappointment and celebrate their effort", value: "validate" },
      { id: "d", text: "Set up tutoring to ensure better grades next time", value: "tutor" }
    ],
    bestAnswer: "validate",
    feedback: {
      validate: "Excellent! You're validating their feelings while emphasizing effort over outcome. This builds resilience and intrinsic motivation while showing emotional support.",
      improve: "Good growth mindset, but address their emotions first. Once they feel heard, they'll be more open to problem-solving.",
      dismiss: "This minimizes their feelings and may make them less likely to share disappointments with you in the future.",
      tutor: "This might send the message that the grade wasn't good enough and could increase pressure rather than building confidence."
    },
    insight: "Validating emotions first creates space for learning and builds emotional trust."
  },
  {
    id: 6,
    title: "Peer Pressure Situations",
    question: "Your 8-year-old says their friends are making fun of them for not having the latest video game. They're begging you to buy it. What's your response?",
    options: [
      { id: "a", text: "Buy the game to help them fit in", value: "buy" },
      { id: "b", text: "Tell them real friends don't care about possessions", value: "lecture" },
      { id: "c", text: "Discuss peer pressure and help them practice responses", value: "discuss" },
      { id: "d", text: "Arrange playdates with different children", value: "avoid" }
    ],
    bestAnswer: "discuss",
    feedback: {
      discuss: "Perfect! You're teaching them about peer pressure while building their confidence to stand up for themselves. This builds critical thinking and social skills.",
      lecture: "While technically true, this dismisses their real social struggle and doesn't give them practical tools to handle the situation.",
      buy: "This teaches that material possessions determine social acceptance and doesn't help them develop resilience against peer pressure.",
      avoid: "While finding good friends is important, they need skills to handle peer pressure in any group situation."
    },
    insight: "Teaching children to handle peer pressure builds confidence and critical thinking skills."
  }
];
