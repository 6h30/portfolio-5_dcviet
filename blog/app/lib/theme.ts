// lib/themes.ts

// Định nghĩa type cho các style của từng phần tử
export type ThemeStyles = {
    app: {
      backgroundColor: string;
    };
    terminal: {
      boxShadow: string;
    };
    window: {
      backgroundColor: string;
      color: string;
      userSelect?: 'none' | 'auto'; // Optional với giá trị cụ thể
    };
    field: {
      backgroundColor: string;
      color: string;
      fontWeight: 'normal' | 'bold'; // Chỉ cho phép 2 giá trị
    };
    cursor: {
      animation: string;
    };
  };
  
  // Định nghĩa type cho object themes tổng
  type Themes = {
    [key: string]: ThemeStyles; // key là 'dark' hoặc 'light'
  };
  
  // Khai báo themes với type
  export const themes: Themes = {
    dark: {
      app: { backgroundColor: '#333444' },
      terminal: { boxShadow: '0 2px 5px #111' },
      window: { backgroundColor: '#222345', color: '#F4F4F4', userSelect: 'none' },
      field: { backgroundColor: '#222333', color: '#F4F4F4', fontWeight: 'normal' },
      cursor: { animation: '1.02s blink-dark step-end infinite' },
    },
    light: {
      app: { backgroundColor: '#ACA9BB' },
      terminal: { boxShadow: '0 2px 5px #33333375' },
      window: { backgroundColor: '#5F5C6D', color: '#E3E3E3' },
      field: { backgroundColor: '#E3E3E3', color: '#474554', fontWeight: 'bold' },
      cursor: { animation: '1.02s blink-light step-end infinite' },
    },
  };

  