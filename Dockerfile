# Sử dụng image node.js với phiên bản cụ thể làm base image
FROM node:20

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép các file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies của ứng dụng
RUN yarn install

# Sao chép toàn bộ source code của ứng dụng vào thư mục làm việc
COPY . .

# Mở cổng mạng cho ứng dụng NestJS chạy trên Docker (điều chỉnh nếu cần thiết)
EXPOSE 4000

# Khởi động ứng dụng khi container được khởi chạy
CMD ["yarn", "run", "start:dev"]
