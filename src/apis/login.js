import axiosClient from "./axiosClient"

const login = async (email, password) => {
  try {
       console.log(process.env.EXPO_PUBLIC_API_URL)
          return await axiosClient.post('/auth/login', {
               email,
               password
          })
     } catch (error) {
          console.log(error)
     }
}

const loginGoogle = async (accessToken) => {
     try {
          const response = await axiosClient.post('/auth/google', accessToken);
          return response.data;
     } catch (error) {
          throw new Error(`Error: ${error}`);
     }
}

export { login, loginGoogle }