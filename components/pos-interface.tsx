 // components/pos-interface.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  Percent,
  Tag,
  X,
  User,
  Users,
  UserCheck,
} from "lucide-react";
import { useServices } from "@/context/service-context";
import { type ServiceCategory, CATEGORY_LABELS } from "@/types/services";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addTransaction } from "@/data/reports-data";
import { useAuth } from "@/context/auth-context";
import { useCustomers } from "@/context/customer-context";
import { CustomerSelector } from "@/components/customer-selector";
import { TherapistSelector } from "@/components/therapist-selector";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

type DiscountType = "none" | "percentage" | "voucher";

export default function PosInterface() {
  const { getActiveServicesByCategory } = useServices();
  const { user } = useAuth();
  const { customers } = useCustomers();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("facial");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>("none");
  const [discountPercentage, setDiscountPercentage] = useState<"5" | "10" | "20">("10");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherAmount, setVoucherAmount] = useState("");
  const [showDiscountOptions, setShowDiscountOptions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<{ id: string; name: string } | null>(
    user?.role !== "manager" ? { id: user?.id || "", name: user?.name || "" } : null,
  );
  const [showTherapistSelector, setShowTherapistSelector] = useState(false);

  const categories = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    id: value as ServiceCategory,
    name: label,
  }));

  const addToCart = (product: { id: string; name: string; price: number; category?: string }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setShowPaymentOptions(false);
    setDiscountType("none");
    setVoucherCode("");
    setVoucherAmount("");
    setShowDiscountOptions(false);
    setSelectedCustomer(null);
    if (user?.role === "manager") {
      setSelectedTherapist(null);
    }
  };

  const handleCheckout = () => {
    if (!selectedCustomer) {
      toast.error("Please select a customer before checkout");
      return;
    }

    if (!selectedTherapist) {
      toast.error("Please select a therapist before checkout");
      return;
    }

    setShowPaymentOptions(true);
  };

  const handlePayment = (method: string) => {
    if (!selectedCustomer || !selectedTherapist) {
      toast.error("Please select both customer and therapist before payment");
      return;
    }

    const transactionId = `TX${Date.now().toString().slice(-6)}`;

    cart.forEach((item) => {
      let itemDiscount = 0;
      if (discountType === "percentage") {
        itemDiscount = item.price * (Number(discountPercentage) / 100);
      } else if (discountType === "voucher" && voucherAmount) {
        const proportion = (item.price * item.quantity) / subtotal;
        itemDiscount = Math.min(Number(voucherAmount) * proportion, item.price);
      }

      addTransaction({
        id: `${transactionId}-${item.id}`,
        date: new Date(),
        customer: selectedCustomer.name,
        customerId: selectedCustomer.id,
        therapistId: selectedTherapist.id,
        therapist: selectedTherapist.name,
        service: item.name,
        category: item.category || "unknown",
        amount: item.price * item.quantity,
        discount: itemDiscount * item.quantity,
        paymentMethod: method,
      });
    });

    const discountInfo =
      discountType === "none"
        ? ""
        : discountType === "percentage"
        ? ` with ${discountPercentage}% discount`
        : ` with voucher ${voucherCode}`;

    toast.success(
      `Payment processed via ${method}${discountInfo} for ${selectedCustomer.name} by ${selectedTherapist.name}. Thank you!`,
    );
    clearCart();
  };

  const applyVoucher = () => {
    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }

    if (!voucherAmount.trim() || isNaN(Number(voucherAmount)) || Number(voucherAmount) <= 0) {
      toast.error("Please enter a valid voucher amount");
      return;
    }

    toast.success(`Voucher ${voucherCode} applied for £${voucherAmount}`);
    setDiscountType("voucher");
    setShowDiscountOptions(false);
  };

  const removeDiscount = () => {
    setDiscountType("none");
    setVoucherCode("");
    setVoucherAmount("");
  };

  const categoryServices = getActiveServicesByCategory(activeCategory);

  const filteredServices = searchQuery
    ? Object.values(categories)
        .flatMap((category) => getActiveServicesByCategory(category.id))
        .filter((service) => service.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : categoryServices;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (discountType === "percentage") {
    discountAmount = subtotal * (Number(discountPercentage) / 100);
  } else if (discountType === "voucher" && voucherAmount) {
    discountAmount = Math.min(Number(voucherAmount), subtotal);
  }

  const total = subtotal - discountAmount;

  const topPadding = user?.role === "manager" ? "mt-0" : "mt-20";

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${topPadding}`}>
      {/* Product Selection */}
      <div className="lg:col-span-2">
        <Card className="border-pink-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search services & products..."
                  className="pl-8 border-pink-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {searchQuery ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center text-center p-2 border-pink-200 hover:bg-pink-50"
                    onClick={() => addToCart(service)}
                  >
                    <span className="font-medium">{service.name}</span>
                    <span className="text-sm text-muted-foreground mt-1">£{service.price.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <Tabs
                defaultValue="facial"
                value={activeCategory}
                onValueChange={(value) => setActiveCategory(value as ServiceCategory)}
              >
                <TabsList className="flex flex-wrap mb-6 h-auto p-1 bg-pink-50">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex-1 py-3 border-2 border-transparent data-[state=active]:border-pink-300 data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 data-[state=active]:shadow-sm m-1 rounded-md"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((category) => (
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    className="m-0 border-2 border-pink-200 p-4 rounded-lg"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {getActiveServicesByCategory(category.id).map((service) => (
                        <Button
                          key={service.id}
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center text-center p-2 border-pink-200 hover:bg-pink-50"
                          onClick={() => addToCart(service)}
                        >
                          <span className="font-medium">{service.name}</span>
                          <span className="text-sm text-muted-foreground mt-1">£{service.price.toFixed(2)}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cart & Checkout */}
      <div>
        <Card className="border-pink-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Cart
              </CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={clearCart}
                >
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col" style={{ height: "calc(100vh - 300px)", minHeight: "400px" }}>
            <div className="flex-grow">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Your cart is empty</div>
              ) : (
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-pink-100 pb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease</span>
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Therapist Selection (only for Manager) */}
            {user?.role === "manager" && (
              <div className="mt-2 mb-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Therapist</Label>
                  {selectedTherapist && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-gray-500"
                      onClick={() => setSelectedTherapist(null)}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="mt-1">
                  {selectedTherapist ? (
                    <div className="flex items-center justify-between p-2 bg-pink-50 rounded-md">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-2 text-pink-600" />
                        <span className="font-medium">{selectedTherapist.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setShowTherapistSelector(true)}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-start text-muted-foreground"
                      onClick={() => setShowTherapistSelector(true)}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Select Therapist
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Customer Selection */}
            <div className="mt-2 mb-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Customer</Label>
                {selectedCustomer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-gray-500"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="mt-1">
                {selectedCustomer ? (
                  <div className="flex items-center justify-between p-2 bg-pink-50 rounded-md">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-pink-600" />
                      <span className="font-medium">{selectedCustomer.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setShowCustomerSelector(true)}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => setShowCustomerSelector(true)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Select Customer
                  </Button>
                )}
              </div>
            </div>

            {/* Discount Options */}
            {cart.length > 0 && !showPaymentOptions && (
              <div className="mt-1 mb-2">
                {!showDiscountOptions && discountType === "none" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-pink-600 border-pink-200"
                    onClick={() => setShowDiscountOptions(true)}
                  >
                    <Percent className="mr-2 h-4 w-4" />
                    Add Discount or Voucher
                  </Button>
                ) : (
                  showDiscountOptions && (
                    <div className="space-y-3 p-3 bg-pink-50 rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-pink-800">Apply Discount</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400"
                          onClick={() => setShowDiscountOptions(false)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="discount-percentage" className="text-sm">
                            Percentage Discount
                          </Label>
                          <div className="flex gap-1">
                            {["5", "10", "20"].map((percent) => (
                              <Button
                                key={percent}
                                type="button"
                                size="sm"
                                variant={
                                  discountPercentage === percent && discountType === "percentage"
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  discountPercentage === percent && discountType === "percentage"
                                    ? "h-7 min-w-[40px] bg-pink-600 hover:bg-pink-700"
                                    : "h-7 min-w-[40px] border-pink-200"
                                }
                                onClick={() => {
                                  setDiscountPercentage(percent as "5" | "10" | "20");
                                  setDiscountType("percentage");
                                  setShowDiscountOptions(false);
                                }}
                              >
                                {percent}%
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-pink-100">
                          <Label htmlFor="voucher-code" className="text-sm">
                            Voucher Code
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              id="voucher-code"
                              placeholder="Enter code"
                              value={voucherCode}
                              onChange={(e) => setVoucherCode(e.target.value)}
                              className="border-pink-200"
                            />
                            <Input
                              id="voucher-amount"
                              placeholder="Amount (£)"
                              type="number"
                              min="0"
                              step="0.01"
                              value={voucherAmount}
                              onChange={(e) => setVoucherAmount(e.target.value)}
                              className="border-pink-200"
                            />
                          </div>
                          <Button size="sm" className="mt-1 bg-pink-600 hover:bg-pink-700" onClick={applyVoucher}>
                            Apply Voucher
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Total */}
            <div className="mt-auto">
              {cart.length > 0 && (
                <div className="flex justify-between font-medium text-lg pt-2 border-t border-pink-100">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              )}

              {discountType !== "none" && (
                <div className="flex justify-between text-sm text-pink-600 mt-1">
                  <span className="flex items-center">
                    {discountType === "percentage" ? (
                      <>
                        <Percent className="mr-1 h-3 w-3" />
                        {discountPercentage}% Discount
                      </>
                    ) : (
                      <>
                        <Tag className="mr-1 h-3 w-3" />
                        Voucher: {voucherCode}
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 text-gray-400 hover:text-red-500"
                      onClick={removeDiscount}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove discount</span>
                    </Button>
                  </span>
                  <span>-£{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {showPaymentOptions ? (
              <div className="w-full space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handlePayment("Card")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay with Card
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handlePayment("Cash")}>
                  <Banknote className="mr-2 h-4 w-4" />
                  Pay with Cash
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setShowPaymentOptions(false)}>
                  Back to Cart
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                <Receipt className="mr-2 h-4 w-4" />
                Checkout
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Customer Selector Modal */}
      {showCustomerSelector && (
        <CustomerSelector
          onSelect={(customer) => {
            setSelectedCustomer(customer);
            setShowCustomerSelector(false);
          }}
          onClose={() => setShowCustomerSelector(false)}
          therapistId={selectedTherapist?.id || user?.id || ""}
        />
      )}

      {/* Therapist Selector Modal */}
      {showTherapistSelector && (
        <TherapistSelector
          onSelect={(therapist) => {
            setSelectedTherapist(therapist);
            setShowTherapistSelector(false);
          }}
          onClose={() => setShowTherapistSelector(false)}
        />
      )}
    </div>
  );
}