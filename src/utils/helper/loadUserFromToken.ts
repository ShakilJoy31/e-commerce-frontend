import { setUser } from "@/components/store/api/user/userSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  address?: string;
  role: string;
  avatar:string;
  phone:string;
}

export const loadUserFromToken = async (dispatch: any) => {
  const token = Cookies.get("__t_beta__token");

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);

      dispatch(
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
          address: decoded.address || "",
          avatar:decoded.avatar || "",
          phone:decoded.phone || ""
        })
      );
    } catch (error) {
      console.error("Invalid token or error in jwt decoding", error);
    }
  } else {
    // Dispatch an empty user object to avoid `null`
    dispatch(
      setUser({
        id: "",
        avatar:"",
        email: "",
        name: "",
        address: "",
        role: "",
        phone:""
      })
    );
  }
};
