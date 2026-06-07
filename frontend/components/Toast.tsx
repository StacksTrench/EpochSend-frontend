export const useToast = () => {
  return { showToast: (msg: string, type: string) => console.log(msg, type) };
};
