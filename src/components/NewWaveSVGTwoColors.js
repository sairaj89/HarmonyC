// NewWaveSVGTwoColors.js
import React from 'react';

const NewWaveSVGTwoColors = ({ baseColor, diamondColor, extraColor }) => {
  return (
    <svg width="1103" height="212" viewBox="0 0 1103 212" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 57.8427V0L53.7685 17.4525C99.1388 29.8756 125.722 35.5613 174.747 43.8806C234.502 51.8762 268.775 54.4393 331.572 54.8508C375.682 54.1773 400.859 52.6949 446.577 47.8698L466.74 45.3766H471.221L472.714 45.8752L456.285 50.8617C439.856 55.8481 409.984 60.3359 355.469 68.3142C300.954 76.2925 238.971 76.7911 212.087 76.7911C185.202 76.7911 174.747 76.7911 141.889 74.2979C109.03 71.8047 124.713 73.7993 67.9574 67.8156C11.2018 61.8318 0 57.8427 0 57.8427Z" fill={diamondColor}/>
      <path d="M0 129.154V89.7615C29.7219 94.201 47.6881 97.5174 74.6784 100.233C166.785 109.974 309.915 100.233 309.915 100.233C387.02 92.4402 429.706 84.8675 505.573 64.8293L657.917 26.9324C697.636 19.567 710.233 18.5985 740.063 14.4663L779.643 9.97852L780.389 12.4717C750.103 17.6006 734.065 20.808 707.204 26.9324C657.961 37.7934 635.448 44.9369 593.693 57.3497C538.719 74.5018 522.326 80.687 465.993 98.2385C391.352 118.517 349.132 126.958 272.576 137.133C155.653 147.802 95.1649 147.137 0 129.154Z" fill={extraColor}/>
      <path d="M0 211.929V155.084C102.164 171.284 164.443 172.037 280.791 164.558C430.663 144.008 516.31 114 674.346 55.8537L731.102 39.3985L759.479 32.4175L794.578 25.4365L831.917 18.9541L873.737 13.469C899.329 11.0694 913.327 10.4482 937.961 9.97852H1103V211.929H0Z" fill={diamondColor}/>
      <path d="M765.673 67.7153C766.108 67.6565 766.543 67.5978 767.33 67.4271C768.049 67.1921 768.417 67.069 768.979 66.9352C769.283 66.8771 769.392 66.8295 769.807 66.79C771.21 66.6346 772.331 66.5233 773.4 66.2995C782.479 64.3985 791.496 62.3581 800.632 60.5901C813.621 58.0768 826.695 55.7592 839.946 53.4038C840.542 53.323 840.924 53.1963 841.601 53.0688C844.222 52.7172 846.549 52.3663 849.174 52.0416C851.909 51.6364 854.345 51.2049 856.909 50.7736C857.036 50.7738 857.243 50.6745 857.558 50.6941C858.89 50.5629 859.908 50.412 861.127 50.3205C861.7 50.2594 862.072 50.1388 862.702 50.0294C863.292 49.9813 863.623 49.9222 864.197 49.9109C865.037 49.8047 865.636 49.6506 866.485 49.5001C867.051 49.4324 867.366 49.361 867.968 49.3392C870.112 49.1096 871.968 48.8305 874.133 48.5578C876.243 48.292 878.044 48.0196 880.043 47.81C880.623 47.7641 881.004 47.6554 881.649 47.5538C882.251 47.5059 882.591 47.4508 883.213 47.4388C884.8 47.2718 886.104 47.0617 887.693 46.8745C888.529 46.821 889.082 46.7448 889.832 46.7372C890.425 46.7067 890.821 46.6075 891.521 46.5214C892.616 46.4168 893.404 46.2992 894.388 46.2529C894.963 46.2113 895.342 46.0985 896.011 46.0036C896.863 45.9389 897.426 45.8562 898.223 45.836C899.065 45.7659 899.672 45.6331 900.532 45.5109C901.11 45.4702 901.437 45.4189 902.065 45.4168C904.182 45.2455 905.998 45.0249 908.07 44.82C908.654 44.7726 908.981 44.7096 909.502 44.7208C910.094 44.6999 910.491 44.6046 911.18 44.5213C912.045 44.4673 912.619 44.4014 913.466 44.3916C914.795 44.2832 915.849 44.1187 917.188 43.9772C918.032 43.9333 918.592 43.8664 919.424 43.8592C920.797 43.7626 921.897 43.6062 923.242 43.4689C923.806 43.4442 924.125 43.4005 924.771 43.4074C931.45 42.9699 937.803 42.4816 944.492 42.0159C946.607 41.9249 948.385 41.8114 950.468 41.7768C956.885 41.5439 962.998 41.232 969.429 40.9488C970.812 40.9291 971.877 40.8807 973.281 40.8983C975.004 40.9609 976.388 40.953 977.771 40.9548C994.503 40.9766 1011.24 40.945 1027.97 41.0512C1034.1 41.0901 1040.22 41.4565 1046.68 41.7439C1049.94 41.9309 1052.88 42.0473 1055.97 42.2468C1056.36 42.3215 1056.61 42.3132 1057.13 42.3582C1057.99 42.4234 1058.57 42.4353 1059.41 42.5178C1060.99 42.6359 1062.3 42.6834 1063.87 42.782C1064.49 42.8348 1064.86 42.8365 1065.52 42.9179C1069.41 43.2167 1073.01 43.4358 1076.88 43.7326C1077.96 43.8565 1078.76 43.9028 1079.74 44.0013C1080.06 44.0381 1080.19 44.0228 1080.59 44.0544C1081.57 44.1284 1082.29 44.1554 1083.27 44.2925C1084.73 44.466 1085.94 44.5295 1087.41 44.7012C1092.54 45.2285 1097.39 45.6477 1102.25 46.0669C1102.25 58.3333 1102.25 70.5998 1102 83.1271C1101.41 83.4011 1101.08 83.4142 1100.74 83.4274C1087.96 81.5549 1075.23 79.5001 1062.38 77.8481C1036.38 74.5032 1010.07 72.7612 983.647 71.6156C956.303 70.4303 928.983 70.7026 901.677 71.7922C871.36 73.0019 841.247 75.4166 811.344 79.0281C780.222 82.7866 749.485 87.5943 719.119 93.4647C691.175 98.8668 663.638 105.073 636.641 112.31C623.248 115.9 609.869 119.522 596.627 123.348C588.982 125.557 581.622 128.202 573.636 130.65C572.771 130.497 572.404 130.344 572.037 130.191C572.037 130.191 572.077 130.188 572.265 130.148C572.595 129.972 572.737 129.836 572.88 129.7C580.836 126.589 588.726 123.398 596.764 120.383C612.277 114.563 627.759 108.699 643.473 103.127C655.208 98.9666 667.288 95.2369 679.687 91.1762C688.189 88.6887 696.163 86.2516 704.26 84.0118C718.034 80.2016 731.867 76.4853 745.712 72.7906C752.322 71.0265 759.017 69.4026 765.673 67.7153Z" fill={extraColor}/>
    </svg>
  );
};

export default NewWaveSVGTwoColors;
