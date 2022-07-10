import Image from "next/image";
import Link from "next/link";

import logoPic from "../../public/azbuka96.svg";

const Logo = () => {
  return (
    <Link href="/">
      <a style={{ height: 40 }}>
        <Image width={135} height={40} src={logoPic} alt="Азбука96" />
      </a>
    </Link>
  );
};

export default Logo;
