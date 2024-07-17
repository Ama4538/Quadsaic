import words from "../../words.json";

const useFetchWord = (letterCount = null) => {
    if (letterCount === null || !words.hasOwnProperty(letterCount)) {
        // Handle cases where input is not valid or word data does not contain
        return;
    }

    let allCurrentWords = words[letterCount];

    // Generate random word from 1 to N, where N is the max length of allCurrentWords - 1
    const index = Math.floor(Math.random() * allCurrentWords.length);
    return allCurrentWords[index]
}

export default useFetchWord;