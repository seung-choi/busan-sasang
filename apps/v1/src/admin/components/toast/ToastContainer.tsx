import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";
import {Toast} from "@plug/ui";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          placement={toast.placement || 'bottomRight'}
          isOpen={true}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
          autoCloseDuration={toast.duration || 3000}
        >
          {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
          <Toast.Description>{toast.description}</Toast.Description>
        </Toast>
      ))}
    </>
  );
};