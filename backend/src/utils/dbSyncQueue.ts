import {User}  from '../models/userModel';

interface RetrySync {
    user: any,
    attempts: number
}

const MAX_RETRIES = 5
const syncFailuresQueue: RetrySync[] = [];

setInterval(async () => {
  while (syncFailuresQueue.length > 0) {
    const nextItem = syncFailuresQueue.shift();
    if(!nextItem) return 
    const {user, attempts} = nextItem
    try {
      await User.updateOne(
        { userId: user.id },
        { $set: user },
        { upsert: true }
      );
      console.log('Recovered Mongo sync for user:', user.id);
    } catch (err) {
      if (attempts + 1 >= MAX_RETRIES) {
        console.log('giving up. max retries reached');
      } else {
        console.error(`Retry ${attempts + 1} failed. Re-queuing:`, user.id);
        syncFailuresQueue.push({user, attempts: attempts + 1});
      }
    }
  }
}, 5000);

export default syncFailuresQueue