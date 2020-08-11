enum MoodType {
    HAPPY = 'happy',
    ANGER = 'anger',
    CRYING = 'crying'
}

type MoodValue = {
    [key in MoodType]: string
}

const value1: MoodValue = {
    [MoodType.HAPPY]: 'aaa',
    [MoodType.ANGER]: 'bbb',
    [MoodType.CRYING]: 'ccc',
}

const value2: MoodValue = {
    happy: '111',
    anger: '222',
    crying: '333'
}