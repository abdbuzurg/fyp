import DataLoader from 'dataloader';
import { MyLoader } from '../types';
import User from '../entities/User';

export const userLoader = ({ entityManager }: MyLoader) => new DataLoader<number, User>( async(userIds) => {
  const users = await entityManager.find(User, { id: userIds as number[]});
  
  const userIdToUser: Record<number, User> = {}
  users.forEach((user) => {
    userIdToUser[user.id] = user;
  });

  return userIds.map((userId) => userIdToUser[userId]);
}); 