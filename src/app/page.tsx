"use client";

import { useCallback, useState } from "react";
import BusinessDrawer from "@/components/BusinessDrawer";
import type { BusinessDetailKind } from "@/components/BusinessDrawer";
import BusinessRail from "@/components/BusinessRail";
import { CustomCursor } from "@/components/CustomCursor";
import DestinationCarousel, {
  DESTINATIONS,
} from "@/components/DestinationCarousel";
import { HeaderBrand } from "@/components/HeaderBrand";
import IntroOverlay from "@/components/IntroOverlay";
import type { Destination, DrawerKind } from "@/types/home";

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false);
  const [mediaEnabled, setMediaEnabled] = useState(false);
  const [activeDestination, setActiveDestination] = useState<Destination>(
    DESTINATIONS[0],
  );
  const [drawer, setDrawer] = useState<DrawerKind>(null);
  const [drawerDetail, setDrawerDetail] =
    useState<BusinessDetailKind | null>(null);

  const handleActiveChange = useCallback(
    (_index: number, destination: Destination) => {
      setActiveDestination(destination);
    },
    [],
  );

  const handleDrawerChange = useCallback(
    (
      nextDrawer: DrawerKind,
      initialDetail: BusinessDetailKind | null = null,
    ) => {
      setDrawer((currentDrawer) =>
        currentDrawer === nextDrawer && initialDetail === null
          ? null
          : nextDrawer,
      );
      setDrawerDetail(initialDetail);
    },
    [],
  );

  const closeDrawer = useCallback(() => {
    setDrawer(null);
    setDrawerDetail(null);
  }, []);

  return (
    <>
      <DestinationCarousel
        mediaEnabled={mediaEnabled || introComplete}
        interactionLocked={!introComplete || drawer !== null}
        onActiveChange={handleActiveChange}
      />
      <HeaderBrand />
      <BusinessRail
        activeDrawer={drawer}
        onDrawerChange={handleDrawerChange}
        primaryColor={activeDestination.primary}
      />
      {drawer ? (
        <BusinessDrawer
          initialDetail={drawerDetail}
          kind={drawer}
          onClose={closeDrawer}
          primaryColor={activeDestination.primary}
        />
      ) : null}
      {!introComplete ? (
        <IntroOverlay
          onPrepareExit={() => setMediaEnabled(true)}
          onComplete={() => setIntroComplete(true)}
        />
      ) : null}
      <CustomCursor />
    </>
  );
}
