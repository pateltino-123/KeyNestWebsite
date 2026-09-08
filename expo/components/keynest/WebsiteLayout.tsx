import React, { useState, createContext, useContext } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import Header from "./Header";
import Footer from "./Footer";
import RentalAnalysisModal from "./RentalAnalysisModal";
import ConsultationModal from "./ConsultationModal";
import MaintenanceTriageModal from "./MaintenanceTriageModal";
import PortalLoginModal from "./PortalLoginModal";

interface LayoutContextType {
  openRentalAnalysis: (city?: string) => void;
  openConsultation: () => void;
  openMaintenanceTriage: () => void;
  openPortalModal: (defaultTab?: "owner" | "tenant") => void;
}

const LayoutContext = createContext<LayoutContextType>({
  openRentalAnalysis: () => {},
  openConsultation: () => {},
  openMaintenanceTriage: () => {},
  openPortalModal: () => {},
});

export const useWebsiteModals = () => useContext(LayoutContext);

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const [rentalAnalysisVisible, setRentalAnalysisVisible] = useState(false);
  const [analysisCity, setAnalysisCity] = useState("");
  const [consultationVisible, setConsultationVisible] = useState(false);
  const [maintenanceVisible, setMaintenanceVisible] = useState(false);
  const [portalVisible, setPortalVisible] = useState(false);
  const [portalDefaultTab, setPortalDefaultTab] = useState<"owner" | "tenant">("owner");

  const openRentalAnalysis = (city?: string) => {
    setAnalysisCity(city || "The Colony");
    setRentalAnalysisVisible(true);
  };

  const openConsultation = () => {
    setConsultationVisible(true);
  };

  const openMaintenanceTriage = () => {
    setMaintenanceVisible(true);
  };

  const openPortalModal = (tab: "owner" | "tenant" = "owner") => {
    setPortalDefaultTab(tab);
    setPortalVisible(true);
  };

  return (
    <LayoutContext.Provider
      value={{
        openRentalAnalysis,
        openConsultation,
        openMaintenanceTriage,
        openPortalModal,
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.layoutRoot}>
          <Header
            onRequestRentalAnalysis={() => openRentalAnalysis()}
            onOpenConsultation={openConsultation}
            onOpenPortalModal={openPortalModal}
          />

          <ScrollView
            style={styles.mainScroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.contentBody}>{children}</View>
            <Footer />
          </ScrollView>

          {/* Global Modals */}
          <RentalAnalysisModal
            visible={rentalAnalysisVisible}
            onClose={() => setRentalAnalysisVisible(false)}
            prefillCity={analysisCity}
          />
          <ConsultationModal
            visible={consultationVisible}
            onClose={() => setConsultationVisible(false)}
          />
          <MaintenanceTriageModal
            visible={maintenanceVisible}
            onClose={() => setMaintenanceVisible(false)}
          />
          <PortalLoginModal
            visible={portalVisible}
            onClose={() => setPortalVisible(false)}
            defaultTab={portalDefaultTab}
          />
        </View>
      </SafeAreaView>
    </LayoutContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B1120",
  },
  layoutRoot: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  contentBody: {
    flex: 1,
    width: "100%",
  },
});
