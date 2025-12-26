import { AnalyticsDashboardContainer } from "../components/AnalyticsDashboardContainer";

// Componente principal refactorizado con Clean Architecture
// Antes: 414 líneas de espagueti mezclado
// Ahora: Componente contenedor limpio con separación de responsabilidades

const AnalyticsDashboard = () => {
  return <AnalyticsDashboardContainer />;
};

export default AnalyticsDashboard;
