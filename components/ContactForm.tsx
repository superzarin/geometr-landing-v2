import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

type FormData = {
  place: string;
  email: string;
  categories: {
    [key: string]: boolean;
  };
};

type ContactFormProps = {
  selectedPlace?: string;
};

const FOOD_CATEGORIES = [
  'Бары',
  'Быстрое питание',
  'Доставка еды',
  'Кафе',
  'Кафе-кондитерские',
  'Кейтеринг',
  'Комбинаты питания',
  'Кофейни',
  'Кофейни автоматы',
  'Кулинарии',
  'Пекарни',
  'Пиццерии',
  'Рестораны',
  'Рюмочные',
  'Столовые',
  'Суши-бары',
  'Точки безалкогольных напитков',
  'Точки кофе',
  'Фудмоллы',
  'Чайные клубы',
];

export default function ContactForm({ selectedPlace }: ContactFormProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<FormData>({
    mode: 'onChange', // Включаем валидацию при изменении полей
    defaultValues: {
      place: selectedPlace || '',
      email: '',
      categories: FOOD_CATEGORIES.reduce((acc, category) => ({
        ...acc,
        [category]: true
      }), {}),
    },
  });

  // Следим за всеми необходимыми полями
  const categories = watch('categories');
  const place = watch('place');
  const email = watch('email');
  
  // Проверяем все условия для активации кнопки
  const isAtLeastOneChecked = Object.values(categories).some(value => value);
  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email || '');
  const isPlaceFilled = !!place?.trim();
  const isFormValid = isAtLeastOneChecked && isEmailValid && isPlaceFilled;

  useEffect(() => {
    if (selectedPlace) {
      setValue('place', selectedPlace);
    }
  }, [selectedPlace, setValue]);

  const onSubmit = (data: FormData) => {
    if (isFormValid) {
      console.log(data);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Прокручиваем страницу к началу
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className="w-full bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">
          Получить доступ к дашборду
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Поле Место */}
          <div>
            <label htmlFor="place" className="block text-sm font-medium text-gray-700">
              Место
            </label>
            <input
              {...register('place', { 
                required: 'Укажите место',
                minLength: {
                  value: 1,
                  message: 'Поле не может быть пустым'
                }
              })}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.place && (
              <p className="mt-1 text-sm text-red-600">{errors.place.message}</p>
            )}
          </div>

          {/* Секция чекбоксов */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Категории общественного питания
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-[300px] overflow-y-auto">
              <FormGroup className="grid grid-cols-1 gap-2">
                {FOOD_CATEGORIES.map((category) => (
                  <Controller
                    key={category}
                    name={`categories.${category}`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            sx={{
                              color: '#4CAF50',
                              '&.Mui-checked': {
                                color: '#4CAF50',
                              },
                            }}
                          />
                        }
                        label={category}
                        className="text-sm"
                      />
                    )}
                  />
                ))}
              </FormGroup>
              {!isAtLeastOneChecked && (
                <FormHelperText error>
                  Выберите хотя бы одну категорию
                </FormHelperText>
              )}
            </div>
          </div>

          {/* Поле Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Укажите email',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Неверный формат email',
                },
              })}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Кнопка отправки */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!isFormValid}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#45a049',
              },
              '&.Mui-disabled': {
                backgroundColor: '#cccccc',
              },
            }}
          >
            Купить за 1500 руб.
          </Button>

          {/* Текст с условиями */}
          <div className="text-xs text-gray-500">
            Нажимая кнопку «Купить за 1500 руб.», вы принимаете условия{' '}
            <a 
              href="https://law.2gis.ru/platform-manager" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              использования платформы
            </a>
          </div>
        </form>
      </div>

      {/* Диалоговое окно успешной отправки */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Спасибо за заявку!
        </DialogTitle>
        <DialogContent>
          <p>
            Мы свяжемся с вами в ближайшее время для подтверждения заявки.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 