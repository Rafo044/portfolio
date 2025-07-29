#### Interpolyasiya
Interpolyasiya mövcud datadakı məlumatları nəzərə alaraq əksik dataları doldurur.Məsələn nöqtələr verilibsə onlara arasında linear(xətti) və yaxudda cubic(sıxlıq) qrafiklərlə bu boşluqları doldururaq qrafiklər yaradılır.
İnterpolyasiya ilə Extrapolyasiya fərqi birinin daxili nöqtələri(əksik dataları)
təxmin etməsi digəri (extrapolyasiya) isə datanın xaricində təxminlər aparmasıdır.

Daha yaxşı anlamaq üçün misallar üzərindən davam edək :

Problem : Deyəkki bizə müxtəlif zamanlarda havanın temperaturu verilib və bizdən bu zamanlar arasındakı(interpolyasiya) havanın temperaturunun təxmin edilməsi istənilir .(Extrapolyasiya)Və yaxudda bu zamanlardan kənarda bir zamanda temperaturun təxmin dilməsi gözlənilir.

##### Havanın  temperaturunun interpolyasiyası
 Məlumatlar: Zamanlar (saat): [0, 3, 6, 9, 12] Temperatur (°C): [25, 27, 28, 26, 24]
 Buna görə polinom interpolyasiyası funksiyasiıını yaratmalıyıq.(polinom-çoxhədli.Əksik dataları polinomun datalarla kəsişməsindən alınan əyri ilə tapacıyıq.)
 
  İmport və dataları daxil edirik :
~~~python
import numpy as np
import matplotlib.pyplot as plt  
# Datalar 
zamanlar = [0, 3, 6, 9, 12] 
temperatur = [25, 27, 28, 26, 24] 
~~~
Polinnom interpolyasiya funksiyasını yaradırıq.Bu funksiya verilmiş nöqtələr olmayan(zaman və tempraturun kəsişməsindəki nöqtələr) , onlar arasındakı dəyərləri, nöqtələrin birləşməsindən təxmin edərək əyrilər yaradır.
~~~python
# Polinom interpolyasiiya funksiyası 
def polinom_interpolyasiya(x, x_data, y_data):     
	n = len(x_data)     
	A = np.zeros((n, n))     
	for i in range(n):         
		A[:, i] = np.power(x_data, i)     
	emsal = np.linalg.solve(A, y_data)     
	y = np.zeros_like(x)     
	for i in range(n):         
		y += emsal[i] * np.power(x, i)     
	return y 
~~~

Əyrilərin yaradılması üçün funksiyaya kəsişmə nöqtələrini birləşdirmək üçün bir aralıq verilir(x_interpolyasiya) və funksiya tətbiq olunur:
~~~python
# İnterpolyasiya aralığı 
x_interpolyasiya = np.linspace(0, 12, 100)  
# Polinom interpolyasiyasının tətbiqi
temperatur_interpolyasiyasi = polinom_interpolyasiya(x_interpolyasiya, zamanlar, temperatur) 
~~~

Alınan nıticələri matplotlibdə vizualizasiyası :
~~~python
# Datalar və interpolyasiya nəticələrinin qrafiki 
plt.plot(zamanlar, temperatur, 'ro', label='Datalar') 
plt.plot(x_interpolyasiya, temperatur_interpolyasiyasi, label='Interpolyasiya') 
plt.xlabel('Zaman (saat)') 
plt.ylabel('Temperatur (°C)') 
plt.title('Havanın temperaturunun Interpolyasiyasi') 
plt.legend() 
plt.grid(True) 
plt.show()
~~~

![[Pasted image 20230728100310.png]]

##### İnterpld
Əl ilə yaratdığımız interpolyasiya funksiyasını scipyşinterpolateşinterpld şəklində import edib onunlar birbaşa yaza bilərik.İnterpld funksiyasının içində kind olaraq linear verərək xətti qrafikdə yaratmaq olar : 

~~~python
from scipy.interpolate import interp1d

# İntegrasiya olunmuş interpolyasiya funksiyasi
interpolyasiya_funksiyasi = interp1d(zamanlar, temperatur, kind='cubic')

# Tətbiqi
temperatur_interpolyasiyasi_2 =interpolyasiya_funksiyasi(x_interpolyasiya)

# Matplotliblə vizualizasiyası
plt.plot(zamanlar, temperatur, 'ro', label='datalar')
plt.plot(x_interpolyasiya, temperatur_interpolyasiyasi_2,color = "purple" ,label='Interpolyasiya')
plt.xlabel('Zaman (saat)')
plt.ylabel('temperatur (°C)')
plt.title('Havanın temperaturunun interpolyasiyası')
plt.legend()
plt.grid(True)
plt.show()
~~~

![[Pasted image 20230728101323.png]]


#### Polinom interpolyasiyası üçün digər algoritmlər


Polinom interpolyasiyası üçün bir çox alqoritmlər inkişaf etdirilib . Məsələn :
 1. Lagrange interpolyasiyası : Bu üsulda verilən hər data nöqtələri üçün ayrıca Lagrange polinomları yaradılır, bu polinomlar toplanaraq ümumi polinom əldə edilir.Məlumat nöqtələrinin sayısı artdıqca daha da mürəkkəbləşir.$P_n(x) = Σ[ y_i * l_i(x) ] (i=0'dan n'ye) burada l_i(x) = Π[ (x - x_j) / (x_i - x_j) ] (j=0'dan n'ye, j ≠ i)$
 2. Newton interpolyasiyası : Bu üsul dərəcələr fərqindən ibarət bir cədvəl yaradaraq ümumi bir interpolyasiya polinomu yaradılır.$P_n(x) = y_0 + (x - x_0) * [y_1 - y_0] / (x_1 - x_0) + (x - x_0) * (x - x_1) * [y_2 - y_1] / [(x_2 - x_1) * (x_2 - x_0)] + ... + (x - x_0) * (x - x_1) * ... * (x - x_{n-1}) * [y_n - y_{n-1}] / [(x_n - x_{n-1}) * (x_n - x_{n-2}) * ... * (x_n - x_0)]$
 3. Spin interpolyasiyası.Linear və spheric interpolyasiyalardan istifadə olunur.
 5. Chebishev interpolyasiyası.İnterpolyasiyanı hesablamaq üçün Chebishev polinomlarından istifadə edir.
$P_n(x) = Σ[ y_i * T_i(u) ] (i=0'dan n'ye)$


Yuxarda qeyd etdiyim interpolyasiya düsturlarını koda çevirək : 

~~~python
import numpy as np
import matplotlib.pyplot as plt

# data set
x_data = np.array([1, 2, 3, 4, 5])
y_data = np.array([3, 5, 4, 6, 8])

# Lagrange İnterpolyasiyası
def lagrange_interpolation(x, y, x_interp):
    n = len(x)
    result = 0.0
    for i in range(n):
        term = y[i]
        for j in range(n):
            if j != i:
                term *= (x_interp - x[j]) / (x[i] - x[j])
        result += term
    return result

# Newton İnterpolyasiyası
def newton_interpolation(x, y, x_interp):
    n = len(x)
    coef = np.zeros(n)
    coef[0] = y[0]
    for i in range(1, n):
        for j in range(n - 1, i - 1, -1):
            y[j] = (y[j] - y[j - 1]) / (x[j] - x[j - i])
        coef[i] = y[i]
    result = 0.0
    for i in range(n):
        term = coef[i]
        for j in range(i):
            term *= (x_interp - x[j])
        result += term
    return result

# Spin İnterpolyasiyası
def spin_interpolation(x, y, x_interp):
    n = len(x)
    c = np.zeros(n)
    d = np.zeros(n)
    c[0] = y[0]
    for i in range(1, n):
        d[i - 1] = y[i] - y[i - 1]
        c[i] = d[i - 1]
        for j in range(i - 1, 0, -1):
            c[j] = (c[j] - c[j - 1]) / (x[i] - x[j])
    result = c[n - 1]
    for i in range(n - 2, -1, -1):
        result = c[i] + (x_interp - x[i]) * result
    return result

# Chebyshev İnterpolyasiyası
def chebyshev_interpolation(x, y, x_interp):
    n = len(x)
    def chebyshev_poly(k, x):
        if k == 0:
            return 1
        elif k == 1:
            return x
        else:
            return 2 * x * chebyshev_poly(k - 1, x) - chebyshev_poly(k - 2, x)

    result = 0.0
    for i in range(n):
        term = y[i] * chebyshev_poly(i, (2 * x_interp - x[0] - x[-1]) / (x[-1] - x[0]))
        result += term
    return result

# x interpolyasiya intervalı
x_interp = np.linspace(1, 5, 100)

# x interpolyasiya dəyərlərinin hesablanması
y_lagrange = lagrange_interpolation(x_data, y_data, x_interp)
y_newton = newton_interpolation(x_data, y_data, x_interp)
y_spin = spin_interpolation(x_data, y_data, x_interp)
y_chebyshev = chebyshev_interpolation(x_data, y_data, x_interp)

# Matplotlib ilə vizuallaşdırma
plt.plot(x_data, y_data, 'ro', label='Nöqtələr')
plt.plot(x_interp, y_lagrange, label='Lagrange')
plt.plot(x_interp, y_newton, label='Newton')
plt.plot(x_interp, y_spin, label='Spin')
plt.plot(x_interp, y_chebyshev, label='Chebyshev')
plt.legend()
plt.xlabel('x')
plt.ylabel('y')
plt.title('İnterpolyasiya üsulları')
plt.grid(True)
plt.show()
~~~

![[Pasted image 20230728151619.png]]




#### Ekstrapolyasiya
Ekstrapolyasiya əlimizdə olan datalarnan gələcək üçün bir təxmin etməyizi mümkün edir.Amma çox halda bu spekülativ ola bilər.Bəzi hallara nəzər salaq :

Yalnış tətbiqinə nümunələr
 1. Datasetin uzunluğu.Dataset nəqədər uzun olarsa təxmin üçün bir o qədər əlverişli olacaqdır əksinə isə yalnış təxminlər verə bilər.
 2. Datanın təxmin edə bilməyəcəyi nöqtələrdə.Məlumat setinin təxmin edə biləcəyi uc sərhədlərdən kənarda qalan hissədəki nöqtələrdə təxminlər yalnış nəticələr verir.
Bir sözlə əgər məlumat seti Linear bir davranış sərgiliyirsə, tətbiq etmək olar.(Xətaları nəzərə alaraq)


İnterpolyasiya məsələsinə uyğun  olaraq ekstrapolyasiyaya bir nümunə göstərək (Python koduyla) : 

~~~python
import numpy as np
import matplotlib.pyplot as plt

# Datalar
zamanlar = np.array([1, 2, 3, 4, 5, 6]) # aylar
temperatur = np.array([25, 27, 28, 26, 24, 23])

# Təxmin edilən zaman
texmini_zaman = 8

# Birinci dərəcədən polinomla tətbiqi
emsal = np.polyfit(zamanlar, temperatur, 1) 
# Ekstrapolyasiya təxmini
texmini_temperatur = np.polyval(emsal, texmini_zaman)

# Matplotliblə vizualizasiya
plt.plot(zamanlar, temperatur, 'ro', label='Datalar')
plt.plot(texmini_zaman, texmini_temperatur, 'bo', label='Ekstrapolyasiya')
plt.xlabel('Zaman (ay)')
plt.ylabel('Temperatur (°C)')
plt.title('Temperatur ekstrapolyasiyası')
plt.legend()
plt.grid(True)
plt.show()
~~~

![[Pasted image 20230728144511.png]]

Təxmini zaman = 22.79



File reseource : ![[interpolyasiya.ipynb]]
![[interpolyasiya.novleri.ipynb]]

![[extrapolation.ipynb]]


