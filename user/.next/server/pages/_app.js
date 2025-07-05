/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./src/app/globals.css":
/*!*****************************!*\
  !*** ./src/app/globals.css ***!
  \*****************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./src/contexts/cartContext.js":
/*!*************************************!*\
  !*** ./src/contexts/cartContext.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CartProvider: () => (/* binding */ CartProvider),\n/* harmony export */   \"default\": () => (/* binding */ useCart)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\n// Helper to get cart from localStorage\nfunction getInitialCart() {\n    if (false) {}\n    return [];\n}\nconst CartContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nfunction CartProvider({ children }) {\n    const [cart, setCart] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(getInitialCart);\n    const [cartCount, setCartCount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        \"CartProvider.useState\": ()=>{\n            const initial = getInitialCart();\n            return initial.reduce({\n                \"CartProvider.useState\": (sum, item)=>sum + item.quantity\n            }[\"CartProvider.useState\"], 0);\n        }\n    }[\"CartProvider.useState\"]);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"CartProvider.useEffect\": ()=>{\n            localStorage.setItem(\"cart\", JSON.stringify(cart));\n            setCartCount(cart.reduce({\n                \"CartProvider.useEffect\": (sum, item)=>sum + item.quantity\n            }[\"CartProvider.useEffect\"], 0));\n        }\n    }[\"CartProvider.useEffect\"], [\n        cart\n    ]);\n    const addToCart = (product, quantity = 1)=>{\n        setCart((prev)=>{\n            const existing = prev.find((item)=>item._id === product._id);\n            if (existing) {\n                return prev.map((item)=>item._id === product._id ? {\n                        ...item,\n                        quantity: item.quantity + quantity\n                    } : item);\n            }\n            return [\n                ...prev,\n                {\n                    ...product,\n                    quantity\n                }\n            ];\n        });\n        setCartCount((prevCount)=>prevCount + quantity);\n    };\n    const removeFromCart = (productId)=>{\n        setCart((prev)=>prev.filter((item)=>item._id !== productId));\n    };\n    const updateQuantity = (productId, quantity)=>{\n        setCart((prev)=>prev.map((item)=>item._id === productId ? {\n                    ...item,\n                    quantity\n                } : item));\n    };\n    const clearCart = ()=>setCart([]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CartContext.Provider, {\n        value: {\n            cart,\n            cartCount,\n            addToCart,\n            removeFromCart,\n            updateQuantity,\n            clearCart\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\bhavishya jain\\\\WEB DEV\\\\backend\\\\inventory management\\\\orderly-frontend-user\\\\src\\\\contexts\\\\cartContext.js\",\n        lineNumber: 56,\n        columnNumber: 5\n    }, this);\n}\nfunction useCart() {\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CartContext);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jb250ZXh0cy9jYXJ0Q29udGV4dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQXVFO0FBRXZFLHVDQUF1QztBQUN2QyxTQUFTSTtJQUNQLElBQUksS0FBNkIsRUFBRSxFQUdsQztJQUNELE9BQU8sRUFBRTtBQUNYO0FBRUEsTUFBTU0sNEJBQWNWLG9EQUFhQTtBQUUxQixTQUFTVyxhQUFhLEVBQUVDLFFBQVEsRUFBRTtJQUN2QyxNQUFNLENBQUNDLE1BQU1DLFFBQVEsR0FBR1osK0NBQVFBLENBQUNFO0lBQ2pDLE1BQU0sQ0FBQ1csV0FBV0MsYUFBYSxHQUFHZCwrQ0FBUUE7aUNBQUM7WUFDekMsTUFBTWUsVUFBVWI7WUFDaEIsT0FBT2EsUUFBUUMsTUFBTTt5Q0FBQyxDQUFDQyxLQUFLQyxPQUFTRCxNQUFNQyxLQUFLQyxRQUFRO3dDQUFFO1FBQzVEOztJQUVBbEIsZ0RBQVNBO2tDQUFDO1lBQ1JHLGFBQWFnQixPQUFPLENBQUMsUUFBUWQsS0FBS2UsU0FBUyxDQUFDVjtZQUM1Q0csYUFBYUgsS0FBS0ssTUFBTTswQ0FBQyxDQUFDQyxLQUFLQyxPQUFTRCxNQUFNQyxLQUFLQyxRQUFRO3lDQUFFO1FBQy9EO2lDQUFHO1FBQUNSO0tBQUs7SUFFVCxNQUFNVyxZQUFZLENBQUNDLFNBQVNKLFdBQVcsQ0FBQztRQUN0Q1AsUUFBUSxDQUFDWTtZQUNQLE1BQU1DLFdBQVdELEtBQUtFLElBQUksQ0FBQyxDQUFDUixPQUFTQSxLQUFLUyxHQUFHLEtBQUtKLFFBQVFJLEdBQUc7WUFDN0QsSUFBSUYsVUFBVTtnQkFDWixPQUFPRCxLQUFLSSxHQUFHLENBQUMsQ0FBQ1YsT0FDZkEsS0FBS1MsR0FBRyxLQUFLSixRQUFRSSxHQUFHLEdBQ3BCO3dCQUFFLEdBQUdULElBQUk7d0JBQUVDLFVBQVVELEtBQUtDLFFBQVEsR0FBR0E7b0JBQVMsSUFDOUNEO1lBRVI7WUFDQSxPQUFPO21CQUFJTTtnQkFBTTtvQkFBRSxHQUFHRCxPQUFPO29CQUFFSjtnQkFBUzthQUFFO1FBQzVDO1FBQ0FMLGFBQWEsQ0FBQ2UsWUFBY0EsWUFBWVY7SUFDMUM7SUFFQSxNQUFNVyxpQkFBaUIsQ0FBQ0M7UUFDdEJuQixRQUFRLENBQUNZLE9BQVNBLEtBQUtRLE1BQU0sQ0FBQyxDQUFDZCxPQUFTQSxLQUFLUyxHQUFHLEtBQUtJO0lBQ3ZEO0lBRUEsTUFBTUUsaUJBQWlCLENBQUNGLFdBQVdaO1FBQ2pDUCxRQUFRLENBQUNZLE9BQ1BBLEtBQUtJLEdBQUcsQ0FBQyxDQUFDVixPQUNSQSxLQUFLUyxHQUFHLEtBQUtJLFlBQVk7b0JBQUUsR0FBR2IsSUFBSTtvQkFBRUM7Z0JBQVMsSUFBSUQ7SUFHdkQ7SUFFQSxNQUFNZ0IsWUFBWSxJQUFNdEIsUUFBUSxFQUFFO0lBRWxDLHFCQUNFLDhEQUFDSixZQUFZMkIsUUFBUTtRQUFDQyxPQUFPO1lBQUV6QjtZQUFNRTtZQUFXUztZQUFXUTtZQUFnQkc7WUFBZ0JDO1FBQVU7a0JBQ2xHeEI7Ozs7OztBQUdQO0FBRWUsU0FBUzJCO0lBQ3RCLE9BQU90QyxpREFBVUEsQ0FBQ1M7QUFDcEIiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYmhhdmlzaHlhIGphaW5cXFdFQiBERVZcXGJhY2tlbmRcXGludmVudG9yeSBtYW5hZ2VtZW50XFxvcmRlcmx5LWZyb250ZW5kLXVzZXJcXHNyY1xcY29udGV4dHNcXGNhcnRDb250ZXh0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbi8vIEhlbHBlciB0byBnZXQgY2FydCBmcm9tIGxvY2FsU3RvcmFnZVxyXG5mdW5jdGlvbiBnZXRJbml0aWFsQ2FydCgpIHtcclxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgY29uc3Qgc3RvcmVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjYXJ0XCIpO1xyXG4gICAgcmV0dXJuIHN0b3JlZCA/IEpTT04ucGFyc2Uoc3RvcmVkKSA6IFtdO1xyXG4gIH1cclxuICByZXR1cm4gW107XHJcbn1cclxuXHJcbmNvbnN0IENhcnRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENhcnRQcm92aWRlcih7IGNoaWxkcmVuIH0pIHtcclxuICBjb25zdCBbY2FydCwgc2V0Q2FydF0gPSB1c2VTdGF0ZShnZXRJbml0aWFsQ2FydCk7XHJcbiAgY29uc3QgW2NhcnRDb3VudCwgc2V0Q2FydENvdW50XSA9IHVzZVN0YXRlKCgpID0+IHtcclxuICAgIGNvbnN0IGluaXRpYWwgPSBnZXRJbml0aWFsQ2FydCgpO1xyXG4gICAgcmV0dXJuIGluaXRpYWwucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIGl0ZW0ucXVhbnRpdHksIDApO1xyXG4gIH0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjYXJ0XCIsIEpTT04uc3RyaW5naWZ5KGNhcnQpKTtcclxuICAgIHNldENhcnRDb3VudChjYXJ0LnJlZHVjZSgoc3VtLCBpdGVtKSA9PiBzdW0gKyBpdGVtLnF1YW50aXR5LCAwKSk7XHJcbiAgfSwgW2NhcnRdKTtcclxuXHJcbiAgY29uc3QgYWRkVG9DYXJ0ID0gKHByb2R1Y3QsIHF1YW50aXR5ID0gMSkgPT4ge1xyXG4gICAgc2V0Q2FydCgocHJldikgPT4ge1xyXG4gICAgICBjb25zdCBleGlzdGluZyA9IHByZXYuZmluZCgoaXRlbSkgPT4gaXRlbS5faWQgPT09IHByb2R1Y3QuX2lkKTtcclxuICAgICAgaWYgKGV4aXN0aW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHByZXYubWFwKChpdGVtKSA9PlxyXG4gICAgICAgICAgaXRlbS5faWQgPT09IHByb2R1Y3QuX2lkXHJcbiAgICAgICAgICAgID8geyAuLi5pdGVtLCBxdWFudGl0eTogaXRlbS5xdWFudGl0eSArIHF1YW50aXR5IH1cclxuICAgICAgICAgICAgOiBpdGVtXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gWy4uLnByZXYsIHsgLi4ucHJvZHVjdCwgcXVhbnRpdHkgfV07XHJcbiAgICB9KTtcclxuICAgIHNldENhcnRDb3VudCgocHJldkNvdW50KSA9PiBwcmV2Q291bnQgKyBxdWFudGl0eSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVtb3ZlRnJvbUNhcnQgPSAocHJvZHVjdElkKSA9PiB7XHJcbiAgICBzZXRDYXJ0KChwcmV2KSA9PiBwcmV2LmZpbHRlcigoaXRlbSkgPT4gaXRlbS5faWQgIT09IHByb2R1Y3RJZCkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHVwZGF0ZVF1YW50aXR5ID0gKHByb2R1Y3RJZCwgcXVhbnRpdHkpID0+IHtcclxuICAgIHNldENhcnQoKHByZXYpID0+XHJcbiAgICAgIHByZXYubWFwKChpdGVtKSA9PlxyXG4gICAgICAgIGl0ZW0uX2lkID09PSBwcm9kdWN0SWQgPyB7IC4uLml0ZW0sIHF1YW50aXR5IH0gOiBpdGVtXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY2xlYXJDYXJ0ID0gKCkgPT4gc2V0Q2FydChbXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Q2FydENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgY2FydCwgY2FydENvdW50LCBhZGRUb0NhcnQsIHJlbW92ZUZyb21DYXJ0LCB1cGRhdGVRdWFudGl0eSwgY2xlYXJDYXJ0IH19PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L0NhcnRDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUNhcnQoKSB7XHJcbiAgcmV0dXJuIHVzZUNvbnRleHQoQ2FydENvbnRleHQpO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiZ2V0SW5pdGlhbENhcnQiLCJzdG9yZWQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwiQ2FydENvbnRleHQiLCJDYXJ0UHJvdmlkZXIiLCJjaGlsZHJlbiIsImNhcnQiLCJzZXRDYXJ0IiwiY2FydENvdW50Iiwic2V0Q2FydENvdW50IiwiaW5pdGlhbCIsInJlZHVjZSIsInN1bSIsIml0ZW0iLCJxdWFudGl0eSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJhZGRUb0NhcnQiLCJwcm9kdWN0IiwicHJldiIsImV4aXN0aW5nIiwiZmluZCIsIl9pZCIsIm1hcCIsInByZXZDb3VudCIsInJlbW92ZUZyb21DYXJ0IiwicHJvZHVjdElkIiwiZmlsdGVyIiwidXBkYXRlUXVhbnRpdHkiLCJjbGVhckNhcnQiLCJQcm92aWRlciIsInZhbHVlIiwidXNlQ2FydCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/contexts/cartContext.js\n");

/***/ }),

/***/ "(pages-dir-node)/./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../app/globals.css */ \"(pages-dir-node)/./src/app/globals.css\");\n/* harmony import */ var _app_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_app_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_cartContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../contexts/cartContext */ \"(pages-dir-node)/./src/contexts/cartContext.js\");\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_cartContext__WEBPACK_IMPORTED_MODULE_2__.CartProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\bhavishya jain\\\\WEB DEV\\\\backend\\\\inventory management\\\\orderly-frontend-user\\\\src\\\\pages\\\\_app.js\",\n            lineNumber: 7,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\bhavishya jain\\\\WEB DEV\\\\backend\\\\inventory management\\\\orderly-frontend-user\\\\src\\\\pages\\\\_app.js\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBOEI7QUFDMkI7QUFFMUMsU0FBU0MsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNwRCxxQkFDRSw4REFBQ0gsK0RBQVlBO2tCQUNYLDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGJoYXZpc2h5YSBqYWluXFxXRUIgREVWXFxiYWNrZW5kXFxpbnZlbnRvcnkgbWFuYWdlbWVudFxcb3JkZXJseS1mcm9udGVuZC11c2VyXFxzcmNcXHBhZ2VzXFxfYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi8uLi9hcHAvZ2xvYmFscy5jc3MnO1xyXG5pbXBvcnQgeyBDYXJ0UHJvdmlkZXIgfSBmcm9tIFwiLi8uLi9jb250ZXh0cy9jYXJ0Q29udGV4dFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxDYXJ0UHJvdmlkZXI+XHJcbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgIDwvQ2FydFByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkNhcnRQcm92aWRlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_app.js\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./src/pages/_app.js"));
module.exports = __webpack_exports__;

})();