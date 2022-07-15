export function logStates(object:any) {
    for (const property in object) {
      console.log(`${property} : ${object[property]}`);
    }
    console.log('-------------------------');
  }