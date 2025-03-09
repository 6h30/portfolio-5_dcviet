import { useContext, useEffect } from "react";
import {
  checkRedirect,
  getCurrentCmdArry,
  isArgInvalid,
} from "app/lib/funcs";
import {
  ProjectContainer,
  ProjectDesc,
  ProjectsIntro,
  ProjectTitle,
} from "../styles/Projects.styled";
import { termContext } from "../terminal1";
import Usage from "../usage";

const Projects: React.FC = () => {
  const { arg, history, rerender } = useContext(termContext);

  /* ===== get current command ===== */
  const currentCommand = getCurrentCmdArry(history);

  /* ===== check current command is redirect ===== */
  useEffect(() => {
    if (checkRedirect(rerender, currentCommand, "projects")) {
      projects.forEach(({ id, url }) => {
        id === parseInt(arg[1]) && window.open(url, "_blank");
      });
    }
  }, [arg, rerender, currentCommand]);

  /* ===== check arg is valid ===== */
  const checkArg = () =>
    isArgInvalid(arg, "go", ["1", "2", "3", "4", "5"]) ? (
      <Usage cmd="projects" />
    ) : null;

  return arg.length > 0 || arg.length > 2 ? (
    checkArg()
  ) : (
    <div data-testid="projects">
      <ProjectsIntro>
      “Nói thì dễ. Cho tôi xem mã”? - Tôi hiểu mà. <br />
      Sau đây là một số dự án của tôi mà bạn không nên bỏ lỡ
      </ProjectsIntro>
      {projects.map(({ id, title, desc }) => (
        <ProjectContainer key={id}>
          <ProjectTitle>{`${id}. ${title}`}</ProjectTitle>
          <ProjectDesc>{desc}</ProjectDesc>
        </ProjectContainer>
      ))}
      <Usage cmd="projects" marginY />
    </div>
  );
};

const projects = [
  {
    id: 1,
    title: "dcviet's Blog",
    desc: "Blog cá nhân của tôi là nơi tôi có thể viết ra những suy nghĩ và kinh nghiệm của mình.",
    url: "https://portfolio-1.site/",
  },
  {
    id: 2,
    title: "CallBike App | Application",
    desc: "CallBike App là một ứng dụng đặt xe có hẹn giờ.",
    url: "https://callbike-app.site",
  },
  {
    id: 3,
    title: "OMD Studio | Website",
    desc: "OMD Studio là một studio cung cấp các dịch vụ kiến trúc chuyên nghiệp.",
    url: "https://omdstudio.art/",
  },
  {
    id: 4,
    title: "API - OMD Studio | API",
    desc: "API RESTful được phát triển cho OMD Studio, để quản lý sản phẩm, các bài viết, dự án kiến trúc.",
    url: "https://omdstudio.art/",
  },
  {
    "id": 5,
    "title": "Ứng dụng AI tạo Portfolio tự động",
    "desc": "Công cụ AI giúp sinh viên và người đi làm tạo portfolio chuyên nghiệp nhanh chóng.",
    "url": "https://genz-portfolio.site/"
  },
  {
    "id": 6,
    "title": "E-learning cho người mới bắt đầu",
    "desc": "Nền tảng học trực tuyến với các khóa học miễn phí về lập trình, thiết kế và marketing.",
    "url": "https://genz-portfolio.site/"
  },
  {
    "id": 7,
    "title": "E-commerce (Shop Bán Hàng Online)",
    "desc": "Nền tảng thương mại điện tử hỗ trợ dropshipping, kết nối trực tiếp với nhà cung cấp như GHTK và Viettel post.",
    "url": "https://genz-portfolio.site/"
  },
  {
    "id": 8,
    "title": "Hệ thống đặt vé sự kiện trực tuyến",
    "desc": "Ứng dụng hỗ trợ đặt vé, quản lý sự kiện, tích hợp mã QR và thanh toán online.",
    "url": "https://genz-portfolio.site/"
  },
  {
    "id": 9,
    "title": "Mạng xã hội cho người yêu sách",
    "desc": "Nền tảng kết nối những người đam mê đọc sách, chia sẻ review và đề xuất sách hay.",
    "url": "https://genz-portfolio.site/"
  },
  {
    "id": 10,
    "title": "Ứng dụng Chat Real-Time (Messenger Clone)",
    "desc": "Ứng dụng nhắn tin real-time giữa hai người dùng hoặc nhóm.",
    "url": "https://genz-portfolio.site/"
  }
];

export default Projects;
