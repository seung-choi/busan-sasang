import TimeDisplay from "./TimeDisplay";
import HeaderEnvInfo from "./HeaderEnvInfo";
import useStationStore from "@plug/v1/app/stores/stationStore";
import React from "react";

const Header = () => {
    // const { stationId } = useParams<{ stationId: string }>();
    const { externalCode } = useStationStore();
    // const parsedStationId = stationId ? stationId : '1';

    return (
      <header className="absolute top-0 left-0 w-full h-16 px-6 flex items-center justify-between bg-gradient-to-b from-primary-300/30 to-primary-700/30 backdrop-blur-lg text-white z-10 shadow-lg border-b border-primary-900/10">
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 active:opacity-75 transition-opacity"
          onClick={() => window.location.reload()}
        >
          <img
            src="/3d-map/assets/logo.png"
            height={30}
            width={30}
            alt="Logo"
            className="[filter:brightness(0)_saturate(100%)_invert(100%)_sepia(0%)_saturate(0%)_hue-rotate(0deg)_brightness(100%)_contrast(100%)] hover:scale-105 transition-transform"
          />
          <h1 className="text-white font-bold text-xl whitespace-nowrap hover:text-primary-100 transition-colors">
            부산교통공사
          </h1>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <TimeDisplay />
        </div>

        <div className="flex items-center gap-6">
          <HeaderEnvInfo externalCode={externalCode} />
        </div>
      </header>
    );
};

export default Header;
