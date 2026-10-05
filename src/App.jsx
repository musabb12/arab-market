import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Layout, ScrollToTop } from './components/Layout.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Toasts from './components/Toasts.jsx'
import RequireAuth from './components/RequireAuth.jsx'

import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import CartPage from './pages/CartPage.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import Wishlist from './pages/Wishlist.jsx'
import ComparePage from './pages/ComparePage.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import Deals from './pages/Deals.jsx'
import Coupons from './pages/Coupons.jsx'
import NewArrivals from './pages/NewArrivals.jsx'
import BestSellers from './pages/BestSellers.jsx'
import Brands from './pages/Brands.jsx'
import BrandDetail from './pages/BrandDetail.jsx'
import GiftCards from './pages/GiftCards.jsx'
import StorePage from './pages/StorePage.jsx'
import Sell from './pages/Sell.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import Account from './pages/Account.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import Addresses from './pages/Addresses.jsx'
import Settings from './pages/Settings.jsx'
import { Login, Register, ForgotPassword } from './pages/AuthPages.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import HelpCenter from './pages/HelpCenter.jsx'
import InfoPage from './pages/InfoPage.jsx'
import NotFound from './pages/NotFound.jsx'

import AdminLayout from './admin/AdminLayout.jsx'
import AdminLogin from './admin/Login.jsx'
import Dashboard from './admin/tabs/Dashboard.jsx'
import Analytics from './admin/tabs/Analytics.jsx'
import ProductsTab from './admin/tabs/Products.jsx'
import CategoriesTab from './admin/tabs/Categories.jsx'
import BrandsTab from './admin/tabs/Brands.jsx'
import ReviewsTab from './admin/tabs/Reviews.jsx'
import OrdersTab from './admin/tabs/Orders.jsx'
import CouponsTab from './admin/tabs/Coupons.jsx'
import PromotionsTab from './admin/tabs/Promotions.jsx'
import SellersTab from './admin/tabs/Sellers.jsx'
import UsersTab from './admin/tabs/Users.jsx'
import PaymentsTab from './admin/tabs/Payments.jsx'
import ShippingTab from './admin/tabs/Shipping.jsx'
import LanguagesTab from './admin/tabs/Languages.jsx'
import CurrenciesTab from './admin/tabs/Currencies.jsx'
import AppearanceTab from './admin/tabs/Appearance.jsx'
import ContentTab from './admin/tabs/Content.jsx'
import TicketsTab from './admin/tabs/Tickets.jsx'
import NotificationsTab from './admin/tabs/Notifications.jsx'
import AdminUsersTab from './admin/tabs/AdminUsers.jsx'
import SystemSettingsTab from './admin/tabs/SystemSettings.jsx'

function StorefrontLayout() {
  return (
    <Layout>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-[var(--site-nav-h)]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toasts />
    </Layout>
  )
}

function Private({ children }) {
  return <RequireAuth>{children}</RequireAuth>
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="products" element={<ProductsTab />} />
        <Route path="categories" element={<CategoriesTab />} />
        <Route path="brands" element={<BrandsTab />} />
        <Route path="reviews" element={<ReviewsTab />} />
        <Route path="orders" element={<OrdersTab />} />
        <Route path="coupons" element={<CouponsTab />} />
        <Route path="promotions" element={<PromotionsTab />} />
        <Route path="sellers" element={<SellersTab />} />
        <Route path="users" element={<UsersTab />} />
        <Route path="payments" element={<PaymentsTab />} />
        <Route path="shipping" element={<ShippingTab />} />
        <Route path="languages" element={<LanguagesTab />} />
        <Route path="currencies" element={<CurrenciesTab />} />
        <Route path="appearance" element={<AppearanceTab />} />
        <Route path="content" element={<ContentTab />} />
        <Route path="tickets" element={<TicketsTab />} />
        <Route path="notifications" element={<NotificationsTab />} />
        <Route path="admin-users" element={<AdminUsersTab />} />
        <Route path="system" element={<SystemSettingsTab />} />
      </Route>

      <Route element={<StorefrontLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/info/:page" element={<InfoPage />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Shopping — members only */}
        <Route path="/products" element={<Private><Products /></Private>} />
        <Route path="/product/:id" element={<Private><ProductDetail /></Private>} />
        <Route path="/category/:categoryId" element={<Private><CategoryPage /></Private>} />
        <Route path="/search" element={<Private><SearchPage /></Private>} />
        <Route path="/cart" element={<Private><CartPage /></Private>} />
        <Route path="/checkout" element={<Private><Checkout /></Private>} />
        <Route path="/order-confirmation" element={<Private><OrderConfirmation /></Private>} />
        <Route path="/wishlist" element={<Private><Wishlist /></Private>} />
        <Route path="/compare" element={<Private><ComparePage /></Private>} />
        <Route path="/track-order" element={<Private><TrackOrder /></Private>} />
        <Route path="/deals" element={<Private><Deals /></Private>} />
        <Route path="/coupons" element={<Private><Coupons /></Private>} />
        <Route path="/new-arrivals" element={<Private><NewArrivals /></Private>} />
        <Route path="/best-sellers" element={<Private><BestSellers /></Private>} />
        <Route path="/brands" element={<Private><Brands /></Private>} />
        <Route path="/brand/:id" element={<Private><BrandDetail /></Private>} />
        <Route path="/gift-cards" element={<Private><GiftCards /></Private>} />
        <Route path="/store/:sellerId" element={<Private><StorePage /></Private>} />
        <Route path="/seller" element={<Private><SellerDashboard /></Private>} />
        <Route path="/account" element={<Private><Account /></Private>} />
        <Route path="/account/orders" element={<Private><OrdersPage /></Private>} />
        <Route path="/account/addresses" element={<Private><Addresses /></Private>} />
        <Route path="/account/settings" element={<Private><Settings /></Private>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
