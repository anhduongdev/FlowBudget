// Lỗi nghiệp vụ có chủ đích (khác lỗi hệ thống) — Action bắt riêng loại này để
// hiển thị thông báo thân thiện cho user thay vì lỗi 500 chung chung.
export class ServiceError extends Error {
  field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = "ServiceError";
    this.field = field;
  }
}
