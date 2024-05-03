import axios from "axios";
import { reactive } from "vue";

const data = reactive({ users: [], total: 100 });
const state = reactive({
  IsHasMore: true,
  Iserror: false,
});

export default function useGetApiData(pageNo, count, isMobile) {
  let _start = (parseInt(pageNo) - 1) * parseInt(count);
  let c;
  state.Isloading = true;
  axios({
    url: "http://localhost:3000/users",
    method: "GET",
    params: { _start: _start, _limit: count },
    cancelToken: new axios.CancelToken((cancel) => {
      cancel = c;
    }),
  })
    .then((res) => {
      if (res.data.length == 0) {
        state.IsHasMore = false;
      }

      //桌面顯示
      if (!isMobile) {
        let getdata = res.data.map((e) => ({
          id: e.id,
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
        }));
        Object.assign(data.users, getdata);
      }
      //手機顯示
      else {
        data.users.push(
          ...res.data.map((e) => ({
            id: e.id,
            firstName: e.firstName,
            lastName: e.lastName,
            email: e.email,
          }))
        );
      }
    })
    .catch((e) => {
      if (axios.isCancel(e)) {
        state.IsHasMore = false;
        return;
      }
      state.Iserror = true;
    });
  return { data, state };
}
