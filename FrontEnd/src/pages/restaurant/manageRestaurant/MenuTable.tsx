import { CirclePlus, Eye, MonitorX, Pencil } from "lucide-react";
import { FoodMenu } from "./ManageRestaurant.types";

interface MenuTableProps {
  menus: FoodMenu[];
  onView: (item: FoodMenu) => void;
  onAddFood: (item: FoodMenu) => void;
  onEdit: (menuId: string) => void;
  onDelete: (menuId: string) => void;
}

const MenuTable = ({
  menus,
  onView,
  onEdit,
  onDelete,
  onAddFood,
}: MenuTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-center text-sm">
            <th className="p-2">Title</th>
            <th className="p-2">Offers</th>
            <th className="p-2">Available</th>
            <th className="p-2">Items</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu._id} className="border-t text-sm text-center">
              <td className="p-2">{menu.title}</td>
              <td className="p-2">
                {menu.offers ? `Yes (${menu.offerDiscount}%)` : "No"}
              </td>
              <td className="p-2">{menu.available ? "Yes" : "No"}</td>
              <td className="p-2">{menu.items.length}</td>
              <td className="p-4 flex space-x-3">
                <button onClick={() => onView(menu)} className="text-blue-500">
                  <Eye size={15} className="text-success" />
                </button>
                <button
                  onClick={() => onEdit(menu._id)}
                  className="text-yellow-500"
                >
                  <Pencil size={15} className="text-dark" />
                </button>
                <button
                  onClick={() => onAddFood(menu)}
                  className="text-red-500"
                >
                  <CirclePlus size={15} className="text-dark" />
                </button>
                <button
                  onClick={() => onDelete(menu._id)}
                  className="text-red-500"
                >
                  <MonitorX size={15} className="text-accent" />
                </button>
              </td>
            </tr>
          ))}
          {menus.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No menus found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MenuTable;
