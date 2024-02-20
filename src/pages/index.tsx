import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="border-[10px] h-[100vh] flex justify-center items-center">
      <div>
        <div className="h-[300px] bg-blue-200">
          <div>video</div>
        </div>

        <div>
          <div aria-label="video controls">
            <div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
