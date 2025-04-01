import React from "react";
import CustomerCard from "./CustomerCard";
import { CustomerGridProps } from "./types";

const CustomerGrid: React.FC<CustomerGridProps> = ({
  entities,
  onEdit,
  onDelete,
  type,
}) => {
  if (!entities || entities.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">
          표시할 {type === "customer" ? "고객" : "가수"}이 없습니다.
        </p>
      </div>
    );
  }

  const handleEdit = (entity: Entity) => {
    onEdit(entity.id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entities.map((entity) => (
        <CustomerCard
          key={entity.id}
          entity={entity}
          onEdit={handleEdit}
          onDelete={onDelete}
          type={type}
        />
      ))}
    </div>
  );
};

export default CustomerGrid;
