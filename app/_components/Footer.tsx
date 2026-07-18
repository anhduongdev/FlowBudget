const productLinks = ["Tính năng", "Bảng giá", "Mobile App", "Cập nhật mới"];
const companyLinks = ["Về chúng tôi", "Blog", "Tuyển dụng", "Đối tác"];
const supportLinks = ["Trung tâm trợ giúp", "Bảo mật", "Điều khoản", "Liên hệ"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-16 px-6 border-t border-outline-variant bg-surface-container-low">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="col-span-2">
          <div className="text-headline-md font-black text-on-surface mb-6">SalaryCycle</div>
          <p className="text-on-surface-variant max-w-xs mb-8">
            Đột phá trong cách quản lý tài chính cá nhân dựa trên chu kỳ thu nhập thực tế của bạn.
          </p>
          <div className="flex gap-4">
            {["share", "mail", "public"].map((icon) => (
              <a
                key={icon}
                className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center hover:bg-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        <FooterLinkGroup title="Sản phẩm" links={productLinks} />
        <FooterLinkGroup title="Công ty" links={companyLinks} />
        <FooterLinkGroup title="Hỗ trợ" links={supportLinks} />
      </div>

      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm">
        <p>© {year} SalaryCycle. Tất cả quyền được bảo lưu.</p>
        <div className="flex gap-8">
          <a className="hover:text-on-surface transition-colors" href="#">
            Chính sách bảo mật
          </a>
          <a className="hover:text-on-surface transition-colors" href="#">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-bold mb-6">{title}</h4>
      <ul className="space-y-4 text-on-surface-variant">
        {links.map((link) => (
          <li key={link}>
            <a className="hover:text-primary transition-colors" href="#">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
