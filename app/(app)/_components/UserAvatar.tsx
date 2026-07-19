// Không có cột avatar_url trong DB — luôn hiện chữ cái đầu tên thay vì ảnh
// giả của người lạ (mockup gốc dùng ảnh stock ngẫu nhiên, không hợp lý cho
// dữ liệu người dùng thật).
export function UserAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-primary-container/20 font-bold text-primary">
      {initial}
    </div>
  );
}
