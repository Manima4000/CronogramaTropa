import React from 'react';
import { Icon } from '../ui/Icon/Icon';

interface LoadingOverlayProps {
  message?: string;
}

/**
 * Overlay de loading que cobre a tela inteira
 * Responsabilidade:
 * - Mostrar feedback visual durante operações assíncronas
 * - Bloquear interações do usuário enquanto carrega
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Carregando...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-military-gray border-t-military-green rounded-full animate-spin"></div>
          <Icon
            name="hourglass-split"
            size="md"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-military-green"
          />
        </div>
        <p className="text-lg font-semibold text-military-dark text-center">
          {message}
        </p>
      </div>
    </div>
  );
};
