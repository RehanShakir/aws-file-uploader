import axios from "axios";
import env from "react-dotenv";
export default axios.create({
  baseURL: env.API_URL,

  // withCredentials: false,
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  // },
});
// export default axios.create({
//   baseURL:
//     "https://electricfrequencymonitor-backend.production.rehanshakir.com",
// });
