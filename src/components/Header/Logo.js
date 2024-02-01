import Image from "next/image";
import Link from "next/link";

import logoPic from "../../public/logo.svg";

const Logo = () => {
  return (
    <Link href="/" legacyBehavior>
      <a style={{ height: 60 }}>
        <Image width={200} height={60} src={logoPic} alt="Азбука96" />
      </a>
    </Link>
  );
};

export default Logo;
