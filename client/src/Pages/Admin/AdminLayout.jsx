import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Tooltip, Drawer } from "antd";
import {
  List,
  Building2,
  LogOut,
  User,
  BookCopy,
  ChevronLeft,
  ChevronRight,
  FileText,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slice/userSlice";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.user);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [location.pathname, isMobile]);

  const menuItems = [
    {
      key: "/admin/articles",
      icon: <FileText size={18} />,
      label: <Link to="/admin/articles">Articles</Link>,
    },
    {
      key: "/admin/banners",
      icon: <Building2 size={18} />,
      label: <Link to="/admin/banners">Gallery</Link>,
    },
    {
      key: "/admin/publications",
      icon: <BookCopy size={18} />,
      label: <Link to="/admin/publications">Publications</Link>,
    },
    {
      key: "/admin/biography",
      icon: <User size={18} />,
      label: <Link to="/admin/biography">Biography</Link>,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  // Sidebar Content Component
  const SidebarContent = ({ isDrawer = false }) => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #071222 0%, #0B1D3A 50%, #122B4D 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #C5A34E 1px, transparent 0)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      {/* Logo / Brand */}
      <div
        style={{
          padding: collapsed && !isDrawer ? "20px 0" : "20px 24px",
          textAlign: "center",
          borderBottom: "1px solid rgba(197, 163, 78, 0.1)",
          position: "relative",
        }}
      >
        {collapsed && !isDrawer ? (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #C5A34E, #E2C96E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              boxShadow: "0 4px 14px rgba(197, 163, 78, 0.3)",
            }}
          >
            <span
              style={{
                color: "#0B1D3A",
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              MO
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C5A34E, #E2C96E)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(197, 163, 78, 0.3)",
              }}
            >
              <span
                style={{
                  color: "#0B1D3A",
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                MO
              </span>
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: 16,
                  fontFamily: "'Cormorant Garamond', serif",
                  lineHeight: 1.2,
                }}
              >
                Admin Panel
              </div>
              <div
                style={{
                  color: "#627D98",
                  fontSize: 9,
                  fontFamily: "'Inter', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginTop: 2,
                }}
              >
                Dashboard
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Label */}
      {(!collapsed || isDrawer) && (
        <div
          style={{
            padding: "20px 24px 8px",
            fontSize: 10,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#627D98",
          }}
        >
          Navigation
        </div>
      )}

      {/* Menu */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: "transparent",
            border: "none",
            padding: "0 8px",
          }}
          theme="dark"
        />
      </div>

      {/* Bottom Section */}
      <div
        style={{
          borderTop: "1px solid rgba(197, 163, 78, 0.1)",
          padding: collapsed && !isDrawer ? "12px 8px" : "16px",
        }}
      >
        {/* Admin Info */}
        {admin && (!collapsed || isDrawer) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              padding: "10px 12px",
              background: "rgba(197, 163, 78, 0.05)",
              border: "1px solid rgba(197, 163, 78, 0.1)",
              borderRadius: 6,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C5A34E, #E2C96E)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "#0B1D3A",
                  fontWeight: 700,
                  fontSize: 12,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {admin.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {admin.name}
              </div>
              <div
                style={{
                  color: "#627D98",
                  fontSize: 10,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Administrator
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <Tooltip title={collapsed && !isDrawer ? "Logout" : ""} placement="right">
          <Button
            type="text"
            icon={<LogOut size={16} style={{ color: "#ef4444" }} />}
            onClick={handleLogout}
            style={{
              width: "100%",
              color: "#ef4444",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed && !isDrawer ? "4px 0" : "4px 12px",
              justifyContent: collapsed && !isDrawer ? "center" : "flex-start",
              height: 40,
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              transition: "all 0.3s",
            }}
            className="admin-logout-btn"
          >
            {(!collapsed || isDrawer) && "Logout"}
          </Button>
        </Tooltip>
      </div>

      {/* Collapse Toggle - Desktop Only */}
      {!isMobile && !isDrawer && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute",
            top: 72,
            right: -14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#0B1D3A",
            border: "1px solid rgba(197, 163, 78, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.3s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#C5A34E";
            e.currentTarget.style.borderColor = "#C5A34E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0B1D3A";
            e.currentTarget.style.borderColor = "rgba(197, 163, 78, 0.2)";
          }}
        >
          {collapsed ? (
            <ChevronRight size={14} color="#C5A34E" className="toggle-icon" />
          ) : (
            <ChevronLeft size={14} color="#C5A34E" className="toggle-icon" />
          )}
        </button>
      )}
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ===== DESKTOP SIDEBAR ===== */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={260}
          collapsedWidth={80}
          style={{
            background: "transparent",
            borderRight: "1px solid rgba(197, 163, 78, 0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <SidebarContent />
        </Sider>
      )}

      {/* ===== MOBILE DRAWER ===== */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          closable={false}
          width={280}
          bodyStyle={{ padding: 0 }}
          headerStyle={{ display: "none" }}
          style={{ padding: 0 }}
        >
          <div style={{ position: "relative", height: "100%" }}>
            <SidebarContent isDrawer={true} />
            <button
              onClick={() => setMobileDrawerOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(197, 163, 78, 0.1)",
                border: "1px solid rgba(197, 163, 78, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.3s",
              }}
            >
              <X size={16} color="#C5A34E" />
            </button>
          </div>
        </Drawer>
      )}

      {/* ===== MAIN AREA ===== */}
      <Layout style={{ background: "#F0F2F5" }}>
        {/* Header */}
        <Header
          style={{
            background: "#FFFFFF",
            padding: isMobile ? "0 16px" : "0 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E8E8E8",
            height: isMobile ? 56 : 64,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                type="text"
                icon={<MenuIcon size={20} />}
                onClick={() => setMobileDrawerOpen(true)}
                style={{
                  padding: "4px 8px",
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
            <div
              style={{
                width: 4,
                height: 20,
                borderRadius: 2,
                background: "linear-gradient(180deg, #C5A34E, #E2C96E)",
              }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: isMobile ? 16 : 18,
                fontFamily: "'Cormorant Garamond', serif",
                color: "#0B1D3A",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {isMobile ? "Dashboard" : "Admin Dashboard"}
            </span>
          </div>

          {admin && (
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12 }}>
              {!isMobile && (
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#627D98",
                      fontFamily: "'Inter', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Administrator
                  </div>
                </div>
              )}
              <div
                style={{
                  width: isMobile ? 32 : 36,
                  height: isMobile ? 32 : 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #C5A34E, #E2C96E)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(197, 163, 78, 0.25)",
                }}
              >
                <span
                  style={{
                    color: "#0B1D3A",
                    fontWeight: 700,
                    fontSize: isMobile ? 12 : 14,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {admin.name?.charAt(0)?.toUpperCase() || "A"}
                </span>
              </div>
            </div>
          )}
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: isMobile ? 12 : 24,
            padding: isMobile ? 16 : 28,
            background: "#FFFFFF",
            borderRadius: 8,
            minHeight: 280,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            border: "1px solid #F0F0F0",
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* ===== CUSTOM STYLES ===== */}
      <style>{`
        /* Sidebar menu overrides */
        .ant-layout-sider .ant-menu-dark,
        .ant-drawer .ant-menu-dark {
          background: transparent !important;
        }

        .ant-layout-sider .ant-menu-dark .ant-menu-item,
        .ant-drawer .ant-menu-dark .ant-menu-item {
          margin: 2px 0 !important;
          border-radius: 6px !important;
          height: 44px !important;
          line-height: 44px !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          color: #9FB3C8 !important;
          transition: all 0.3s !important;
        }

        .ant-layout-sider .ant-menu-dark .ant-menu-item:hover,
        .ant-drawer .ant-menu-dark .ant-menu-item:hover {
          background: rgba(197, 163, 78, 0.08) !important;
          color: #C5A34E !important;
        }

        .ant-layout-sider .ant-menu-dark .ant-menu-item-selected,
        .ant-drawer .ant-menu-dark .ant-menu-item-selected {
          background: rgba(197, 163, 78, 0.12) !important;
          color: #C5A34E !important;
          border-right: none !important;
          position: relative;
        }

        .ant-layout-sider .ant-menu-dark .ant-menu-item-selected::before,
        .ant-drawer .ant-menu-dark .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: linear-gradient(180deg, #C5A34E, #E2C96E);
          border-radius: 0 2px 2px 0;
        }

        .ant-layout-sider .ant-menu-dark .ant-menu-item-selected .anticon,
        .ant-layout-sider .ant-menu-dark .ant-menu-item-selected svg,
        .ant-drawer .ant-menu-dark .ant-menu-item-selected .anticon,
        .ant-drawer .ant-menu-dark .ant-menu-item-selected svg {
          color: #C5A34E !important;
        }

        .ant-layout-sider .ant-menu-dark .ant-menu-item .anticon,
        .ant-layout-sider .ant-menu-dark .ant-menu-item svg,
        .ant-drawer .ant-menu-dark .ant-menu-item .anticon,
        .ant-drawer .ant-menu-dark .ant-menu-item svg {
          color: #627D98 !important;
          transition: color 0.3s !important;
        }

        .ant-layout-sider .ant-menu-dark .ant-menu-item:hover .anticon,
        .ant-layout-sider .ant-menu-dark .ant-menu-item:hover svg,
        .ant-drawer .ant-menu-dark .ant-menu-item:hover .anticon,
        .ant-drawer .ant-menu-dark .ant-menu-item:hover svg {
          color: #C5A34E !important;
        }

        .ant-layout-sider .ant-menu-dark .ant-menu-item a,
        .ant-drawer .ant-menu-dark .ant-menu-item a {
          color: inherit !important;
          font-family: 'Inter', sans-serif !important;
        }

        /* Logout button hover */
        .admin-logout-btn:hover {
          background: rgba(239, 68, 68, 0.08) !important;
        }

        /* Toggle icon color swap on hover */
        button:hover .toggle-icon {
          color: #0B1D3A !important;
        }

        /* Scrollbar for sidebar */
        .ant-layout-sider::-webkit-scrollbar,
        .ant-drawer-body::-webkit-scrollbar {
          width: 4px;
        }

        .ant-layout-sider::-webkit-scrollbar-track,
        .ant-drawer-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .ant-layout-sider::-webkit-scrollbar-thumb,
        .ant-drawer-body::-webkit-scrollbar-thumb {
          background: rgba(197, 163, 78, 0.2);
          border-radius: 2px;
        }

        /* Remove antd sider default trigger */
        .ant-layout-sider-trigger {
          display: none !important;
        }

        /* Drawer styles */
        .ant-drawer-content-wrapper {
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15) !important;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .ant-layout-header {
            padding: 0 12px !important;
          }
        }

        @media (max-width: 480px) {
          .ant-layout-content {
            margin: 8px !important;
            padding: 12px !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default AdminLayout;