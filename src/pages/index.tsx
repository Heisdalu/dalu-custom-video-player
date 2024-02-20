import Image from "next/image";
import { Inter } from "next/font/google";
import Backward from "../../public/icons/backward";
import Play from "../../public/icons/play";
import Forward from "../../public/icons/forward";
import Stop from "../../public/icons/stop";
import Volume from "../../public/icons/volume";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="border-[10px] h-[100vh] flex justify-center items-center">
      <div>
        <div className="w-[500px] h-[300px] bg-blue-200">
          <div>video</div>
        </div>

        <div className="border-[1px] px-[0.5rem] py-[1rem] flex items-center justify-between">
          <div aria-label="video controls" className="flex space-x-[1rem]">
            <button className="">
              <Backward />
            </button>
            <button>
              <Play />
            </button>
            <button>
              <Forward />
            </button>
            <button>
              <Stop />
            </button>
          </div>

          <div className="items-center flex space-x-[0.5rem]">
            <div
              aria-label="video direction"
              className="bg-[#D8D8D8] overflow-hidden rounded-[1rem] h-[10px] w-[150px]"
            >
              <div
                role="progressbar"
                className="bg-[#F5A623] w-[50%] h-[100%]"
              ></div>
            </div>
            <span className="text-[0.8rem]">10:35 / 5:00</span>
          </div>

          <div className="flex items-center space-x-[0.5rem]">
            <Volume />
            <div className="overflow-hidden rounded-[1rem] h-[5px] w-[50px] bg-[#D8D8D8]">
              <div
                role="progressbar"
                className="bg-[#F5A623] h-[100%] w-[20%]"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
