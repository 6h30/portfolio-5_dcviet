import {
  Cmd,
  HeroContainer,
  Link,
  PreImg,
  PreName,
  PreNameMobile,
  PreWrapper,
  Seperator,
} from "../styles/Welcome.styled";

const Welcome: React.FC = () => {
  return (
    <HeroContainer data-testid="welcome">
      <div className="info-section">
        <PreName>
          {`        
██████╗  ██████╗██╗   ██╗██╗███████╗████████╗
██╔══██╗██╔════╝██║   ██║██║██╔════╝╚══██╔══╝
██║  ██║██║     ██║   ██║██║█████╗     ██║   
██║  ██║██║     ╚██╗ ██╔╝██║██╔══╝     ██║   
██████╔╝╚██████╗ ╚████╔╝ ██║███████╗   ██║   
╚═════╝  ╚═════╝  ╚═══╝  ╚═╝╚══════╝   ╚═╝                                              
          `}
        </PreName>
        <PreWrapper>
          <PreNameMobile>
            {`
          `}
          </PreNameMobile>
        </PreWrapper>
        <div>Portfolio phong cách "dòng lệnh"</div>
        <Seperator>----</Seperator>
        <div>
          Xem thêm các mẫu portfolio khác{" "}
          <Link href="https://www.portfolio-1.site" target="_blank">
            GenZ's portfolio
          </Link>
          .
        </div>
        <Seperator>----</Seperator>
        <div>
          Để xem danh sách các lệnh, nhập `<Cmd>help</Cmd>`.
        </div>
      </div>
      <div className="illu-section">
        <PreImg>
          {`

         `}
        </PreImg>
      </div>
    </HeroContainer>
  );
};

export default Welcome;
