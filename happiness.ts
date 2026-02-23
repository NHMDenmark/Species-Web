function createHappiness(): string {
  const noun = [
    "A penguin",
    "A lion",
    "A sealion",
    "A biologist",
    "A puppy",
    "A goldfish",
    "A cat",
    "The sun",
    "A ghost",
    "A dragon",
    "A bumble-bee",
    "A narwhal",
    "A unicorn",
    "A squirrel",
    "A butterfly",
    "A star",
    ]

  const verb = [
    "is waving",
    "is smiling",
    "is winking",
    "is basking",
    "is dancing",
    "is jumping",
    "is singing",
    "is floating",
    "is twirling",
    "is swimming",
    "is running",
  ]

  const adjective = [
    "happily",
    "sweetly",
    "joyfully",
    "excitedly",
    "playfully",
    "cheerfully",
    "gently",
    "gracefully",
    "enthusiastically",
    "",
    "prettily",
    "slowly",    
  ]

  const randomItem = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)]

  return `${randomItem(noun)} ${randomItem(verb)} ${randomItem(adjective)}.`
}

const happiness = createHappiness()
export { happiness }
