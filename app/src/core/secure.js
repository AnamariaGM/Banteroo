import * as SecureStore from 'expo-secure-store';

async function set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      await SecureStore.setItemAsync(key, serializedValue);
      // console.log('Credentials stored',key,serializedValue)
    } catch (error) {
      console.log('Error setting item:', error);
    }
  }
  
  async function get(key) {
    try {
      const serializedValue = await SecureStore.getItemAsync(key);
      return JSON.parse(serializedValue);
    } catch (error) {
      console.log('Error getting item:', error);
      return null;
    }
  }
  

async function remove(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log('Error removing item:', error);
  }
}

async function wipe() {
  try {

    await SecureStore.deleteItemAsync('credentials');

  } catch (error) {
    console.log('Error clearing storage:', error);
  }
}

export default { set, get, remove, wipe };
