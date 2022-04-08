const limitElement: HTMLInputElement = document.querySelector('#limit') as HTMLInputElement;
const lengthElement: HTMLInputElement = document.querySelector('#length') as HTMLInputElement;
const buttonElement: HTMLInputElement = document.querySelector('#button') as HTMLInputElement;
let stringList = [];

const text = `"Well, Prince, so Genoa and Lucca are now just family estates of the Buonapartes. But I warn you, if you don't tell me that this means war, if you still try to defend the infamies and horrors perpetrated by that Antichrist--I really believe he is Antichrist--I will have nothing more to do with you and you are no longer my friend, no longer my 'faithful slave,' as you call yourself! But how do you do? I see I have frightened you--sit down and tell me all the news." 
It was in July, 1805, and the speaker was the well-known Anna Pavlovna Scherer, maid of honor and favorite of the Empress Marya Fedorovna. With these words she greeted Prince Vasili Kuragin, a man of high rank and importance, who was the first to arrive at her reception. Anna Pavlovna had had a cough for some days. She was, as she said, suffering from la grippe; grippe being then a new word in St. Petersburg, used only by the elite. 
All her invitations without exception, written in French, and delivered by a scarlet-liveried footman that morning, ran as follows: 
"If you have nothing better to do, Count [or Prince], and if the prospect of spending an evening with a poor invalid is not too terrible, I shall be very charmed to see you tonight between 7 and 10--Annette Scherer." 
"Heavens! what a virulent attack!" replied the prince, not in the least disconcerted by this reception. He had just entered, wearing an embroidered court uniform, knee breeches, and shoes, and had stars on his breast and a serene expression on his flat face. He spoke in that refined French in which our grandfathers not only spoke but thought, and with the gentle, patronizing intonation natural to a man of importance who had grown old in society and at court. He went up to Anna Pavlovna, kissed her hand, presenting to her his bald, scented, and shining head, and complacently seated himself on the sofa. 
"First of all, dear friend, tell me how you are. Set your friend's mind at rest," said he without altering his tone, beneath the politeness and affected sympathy of which indifference and even irony could be discerned. 
"Can one be well while suffering morally? Can one be calm in times like these if one has any feeling?" said Anna Pavlovna. "You are staying the whole evening, I hope?" 
"And the fete at the English ambassador's? Today is Wednesday. I must put in an appearance there," said the prince. "My daughter is coming for me to take me there." 
"I thought today's fete had been canceled. I confess all these festivities and fireworks are becoming wearisome." 
"If they had known that you wished it, the entertainment would have been put off," said the prince, who, like a wound-up clock, by force of habit said things he did not even wish to be believed. 
"Don't tease! Well, and what has been decided about Novosiltsev's dispatch? You know everything." 
"What can one say about it?" replied the prince in a cold, listless tone. "What has been decided? They have decided that Buonaparte has burnt his boats, and I believe that we are ready to burn ours." 
Prince Vasili always spoke languidly, like an actor repeating a stale part. Anna Pavlovna Scherer on the contrary, despite her forty years, overflowed with animation and impulsiveness. To be an enthusiast had become her social vocation and, sometimes even when she did not feel like it, she became enthusiastic in order not to disappoint the expectations of those who knew her. The subdued smile which, though it did not suit her faded features, always played round her lips expressed, as in a spoiled child, a continual consciousness of her charming defect, which she neither wished, nor could, nor considered it necessary, to correct. 
In the midst of a conversation on political matters Anna Pavlovna burst out: 
"Oh, don't speak to me of Austria. Perhaps I don't understand things, but Austria never has wished, and does not wish, for war. She is betraying us! Russia alone must save Europe. Our gracious sovereign recognizes his high vocation and will be true to it. That is the one thing I have faith in! Our good and wonderful sovereign has to perform the noblest role on earth, and he is so virtuous and noble that God will not forsake him. He will fulfill his vocation and crush the hydra of revolution, which has become more terrible than ever in the person of this murderer and villain! We alone must avenge the blood of the just one.... Whom, I ask you, can we rely on?... England with her commercial spirit will not and cannot understand the Emperor Alexander's loftiness of soul. She has refused to evacuate Malta. She wanted to find, and still seeks, some secret motive in our actions. What answer did Novosiltsev get? None. The English have not understood and cannot understand the self-abnegation of our Emperor who wants nothing for himself, but only desires the good of mankind. And what have they promised? Nothing! And what little they have promised they will not perform! Prussia has always declared that Buonaparte is invincible, and that all Europe is powerless before him.... And I don't believe a word that Hardenburg says, or Haugwitz either. This famous Prussian neutrality is just a trap. I have faith only in God and the lofty destiny of our adored monarch. He will save Europe!" 
`
buttonElement.onclick = (e) => {
    limitElement.disabled = true;
    lengthElement.disabled = true;
    buttonElement.disabled = true;
    stringList = [];
    let count = parseInt(lengthElement.value);
    while (count > 0) {
        stringList.push(makeString());
        --count;
    }
    (document.querySelector('.progress__text') as any).innerText = `Progress:${0} of ${stringList.length}`
    Promise.all(queue(stringList, mapperFn, parseInt(limitElement.value))).then(()=>{
        limitElement.disabled = false;
        lengthElement.disabled = false;
        buttonElement.disabled = false;
    })

};

const mapperFn = (a) => new Promise((resolve) => {
    const divElement = document.createElement('div');
    const headerElement = document.createElement('h3');
    headerElement.innerText = `${a+1}. ${stringList[a]}`;
    divElement.classList.add("result__item");
    divElement.append(headerElement);
    document.querySelector('.result__list').append(divElement);
    setTimeout(() => resolve(a), Math.round(Math.random() * 9000) + 1000);
});
const queue: (list: string[], mapper: (string) => Promise<any>, limit: number) => Promise<any>[] =  (list, mapper, limit) => {
    let i = 0;
    const result = [];
    const executing = [];
    const enqueue = () => {
        if (i === list.length) return Promise.resolve();
        const promise = mapper(i).then((index) => {
            const element = document.createElement('p')
            element.innerText = text.split('.')[index];
            document.querySelectorAll('.result__item')[index].append(element);
            (document.querySelector('.progress__text') as any).innerText = `Progress:${result.length - executing.length} of ${list.length}`
        });
        result.push(promise);
        const executed = promise.then(() => executing.splice(executing.indexOf(executed), 1));
        executing.push(executed);
        let resolve = Promise.resolve();
        if (executing.length >= limit) resolve = Promise.race(executing);
        i++;
        return resolve.then(() => enqueue());
    };
    enqueue().then(() => result);
    return result;
}


const makeString = (): string => {
    let result = '';
    const characters = 'ABCDEFGHIJ KLMNOPQRST UVWXYZ abcdefghij klmnopq rstuvwxyz ';
    const length = Math.floor(Math.random() * (200 - 10 + 1) + 10)
    let counter = 0
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() *
            characters.length));
        counter++;
    }

    return result;
}


