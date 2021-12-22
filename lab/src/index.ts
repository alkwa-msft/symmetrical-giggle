import { MyLibrary } from './MyLibrary';
import { NameTag } from './nameTag';
import { ACSCallingProvider } from './ACSCallingProvider';
import { ACSMicrophoneSetting } from './ACSMicrophoneSetting';
console.log('See this in your browser console: Typescript Webpack Starter Launched');

const myLibrary = new MyLibrary();
const result = myLibrary.executeDependency();

console.log(`A random number ${result}`);

const a = NameTag;
const b = ACSCallingProvider;
const c = ACSMicrophoneSetting;
console.log(a);
console.log(b);
console.log(c);