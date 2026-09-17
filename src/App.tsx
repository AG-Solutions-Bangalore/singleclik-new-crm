import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-image-crop/dist/ReactCrop.css";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Home from "@/modules/dashboard/pages/Home";
import SignIn from "@/modules/auth/pages/SignIn";
import SignUp from "@/modules/auth/pages/SignUp";
import ForgetPassword from "@/modules/auth/pages/ForgetPassword";
import Maintenance from "@/modules/maintenance/pages/Maintenance";
import Profile from "@/modules/profile/pages/Profile";
import ChangePassword from "@/modules/profile/pages/ChangePassword";
import MemberList from "@/modules/members/pages/MemberList";
import MemberView from "@/modules/members/pages/MemberView";
import MemberEdit from "@/modules/members/pages/MemberEdit";
import CategoryView from "@/modules/members/pages/CategoryView";
import CategoryList from "@/modules/categories/pages/category/CategoryList";
import CategoryAdd from "@/modules/categories/pages/category/CategoryAdd";
import CategoryEdit from "@/modules/categories/pages/category/CategoryEdit";
import SubCategoryList from "@/modules/categories/pages/sub-category/SubCategoryList";
import SubCategoryAdd from "@/modules/categories/pages/sub-category/SubCategoryAdd";
import SubCategoryEdit from "@/modules/categories/pages/sub-category/SubCategoryEdit";
import UserList from "@/modules/consumers/pages/UserList";
import HoldUser from "@/modules/consumers/pages/HoldUser";
import DeleteUser from "@/modules/consumers/pages/DeleteUser";
import SliderList from "@/modules/sliders/pages/adv/SliderList";
import AddSlider from "@/modules/sliders/pages/adv/AddSlider";
import EditSlider from "@/modules/sliders/pages/adv/EditSlider";
import PopupSlider from "@/modules/sliders/pages/popup/PopupSlider";
import AddPopupSlider from "@/modules/sliders/pages/popup/AddPopupSlider";
import EditPopupSlider from "@/modules/sliders/pages/popup/EditPopupSlider";
import ProductList from "@/modules/products/pages/ProductList";
import ProductAdd from "@/modules/products/pages/ProductAdd";
import ProductEdit from "@/modules/products/pages/ProductEdit";
import FeedbackList from "@/modules/feedback/pages/FeedbackList";
import NotificationList from "@/modules/notifications/pages/NotificationList";
import AddNotification from "@/modules/notifications/pages/AddNotification";
import EditNotification from "@/modules/notifications/pages/EditNotification";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/maintenance" element={<Maintenance />} />

        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/change-password" element={<ProtectedRoute element={<ChangePassword />} />} />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/member-view/:id" element={<MemberView />} />
        <Route path="/member-edit/:id" element={<MemberEdit />} />
        <Route path="/category-view/:id" element={<CategoryView />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/sub-category" element={<SubCategoryList />} />
        <Route path="/add-subCategory" element={<SubCategoryAdd />} />
        <Route path="/add-category" element={<CategoryAdd />} />
        <Route path="/category-edit/:id" element={<CategoryEdit />} />
        <Route path="/sub-category-edit/:id" element={<SubCategoryEdit />} />
        <Route path="/user-list" element={<UserList />} />
        <Route path="/adv-slider" element={<SliderList />} />
        <Route path="/popup-slider" element={<PopupSlider />} />
        <Route path="/add-slider" element={<AddSlider />} />
        <Route path="/slider-edit/:id" element={<EditSlider />} />
        <Route path="/add-popup-slider" element={<AddPopupSlider />} />
        <Route path="/popup-slider-edit/:id" element={<EditPopupSlider />} />
        <Route path="/hold-user" element={<HoldUser />} />
        <Route path="/delete-user" element={<DeleteUser />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/add-product" element={<ProductAdd />} />
        <Route path="/edit-product/:id" element={<ProductEdit />} />
        <Route path="/feedback" element={<FeedbackList />} />
        <Route path="/notification" element={<NotificationList />} />
        <Route path="/add-notification" element={<AddNotification />} />
        <Route path="/edit-notification/:id" element={<EditNotification />} />
      </Routes>
    </>
  );
};

export default App;
