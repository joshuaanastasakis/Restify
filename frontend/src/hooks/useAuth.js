import { useEffect } from 'react';
import { useUser } from './useUser';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
  const { user, addUser, removeUser } = useUser();
  const { getItem } = useLocalStorage();

  useEffect(() => {
    // const user = getItem('user');
    // console.log("useAuth after get item");
    if (user) {
      console.log("Adding user");
      addUser(JSON.parse(user));
    }
  }, []);

  const logout = () => {
    removeUser();
  };

  const getUser=() => {
    return user;
  }

  return { user, logout, getUser};
};